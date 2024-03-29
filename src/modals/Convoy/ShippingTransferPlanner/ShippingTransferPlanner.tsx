import { isUndefined } from "lodash-es";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { LoadingBar } from "@Components/LoadingBar";
import { Grid, Row } from "@Components/grid";
import { Label } from "@Components/label";
import { TogglePager } from "@Components/togglePager";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { useDBValue } from "@Hooks/useDBValue";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  getShippingPlan,
  getShippingPlanItems,
} from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { categorySelectorElements } from "../../CityData/Vehicle/cityVehiclesInventory";
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

  const plan = useDBValue(
    useCallback(
      () => getShippingPlan(currentShippingPlan),
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

  const items = useMemo(() => {
    if (inventory && inventory.has(inCategory)) {
      return (
        plan &&
        inventory
          .get(inCategory)!
          .map(({ translation, ID, number }) => (
            <PlannerTransferItem
              plan={plan.ID}
              item={ID}
              label={translation}
              key={ID}
              number={number}
            />
          ))
      );
    }
    return false;
  }, [inventory, inCategory, plan]);

  const body = useMemo(
    () => (
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
    ),
    [aCapacity, aWeight, bCapacity, bWeight, children, inCategory, items]
  );

  const footer = useMemo(() => <></>, []);

  const header = useMemo(
    () => <Label type="painted">{plan?.name ?? ""}</Label>,
    [plan?.name]
  );

  return <Modal body={body} footer={footer} header={header} />;
}
