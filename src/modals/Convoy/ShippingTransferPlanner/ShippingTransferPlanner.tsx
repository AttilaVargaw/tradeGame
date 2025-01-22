import { isUndefined } from "lodash-es";
import { PropsWithChildren, useCallback, useState } from "react";
import styled from "styled-components";

import { LoadingBar } from "@Components/LoadingBar";
import { Grid, Row } from "@Components/grid";
import { Label } from "@Components/label";
import { TogglePager } from "@Components/togglePager";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { useDBValue } from "@Hooks/useDBValue";
import { categorySelectorElements } from "@Modals/CityData/Vehicle/categorySelectorElements";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  getShippingPlanItems,
  getShippingPlans,
} from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import Modal from "../../Modal";
import { PlannerTransferItem } from "../PlannerTransferItem";

const Container = styled(Grid)`
  margin-top: 1em;
`;

function InventoryLoadingBar({
  weight,
  capacity,
}: {
  weight?: number;
  capacity?: number;
}) {
  return isUndefined(weight) || isUndefined(capacity) ? (
    false
  ) : (
    <div style={{ flex: 1, marginTop: "1em" }}>
      <LoadingBar
        percent={
          (isUndefined(capacity) || isUndefined(weight)
            ? 0
            : weight / capacity) * 100
        }
      />
    </div>
  );
}

export type MoveFunction = (
  inventoryAID: ID,
  inventoryBID: ID,
  amount: number,
  item: ID
) => Promise<void>;

const updateEvents = [DBEvents.shippingPlanUpdate];

export function ShippingTransferPlanner({
  aWeight,
  bWeight,
  aCapacity,
  children,
  bCapacity,
}: PropsWithChildren<{
  aWeight?: number;
  bWeight?: number;
  aCapacity?: number;
  bCapacity?: number;
}>) {
  const [inCategory, setInCategory] = useState<number>(0);

  const [currentShippingPlan] = useCurrentShippingPlan();

  const plans = useDBValue(
    useCallback(
      () => getShippingPlans(currentShippingPlan),
      [currentShippingPlan]
    ),
    updateEvents
  );

  const inventory = useDBValue(
    useCallback(
      () => getShippingPlanItems(currentShippingPlan),
      [currentShippingPlan]
    )
  );

  const body = () => {
    const items =
      plans && inventory && inventory.has(inCategory)
        ? plans[0] &&
          inventory
            .get(inCategory)!
            .map(({ translation, ID, number }) => (
              <PlannerTransferItem
                plan={plans[0].ID}
                item={ID}
                label={translation}
                key={ID}
                number={number}
              />
            ))
        : false;

    return (
      <>
        {children}
        <TogglePager
          selected={inCategory}
          onChange={setInCategory}
          values={categorySelectorElements}
        />
        {items && (
          <Row style={{ gap: "1em" }}>
            <InventoryLoadingBar capacity={aCapacity} weight={aWeight} />
            <Container $num={2}>{items}</Container>
            <InventoryLoadingBar capacity={bCapacity} weight={bWeight} />
          </Row>
        )}
      </>
    );
  };

  const footer = <></>;

  const header = <Label type="painted">{plans?.[0]?.name ?? ""}</Label>;

  return <Modal body={body()} footer={footer} header={header} />;
}
