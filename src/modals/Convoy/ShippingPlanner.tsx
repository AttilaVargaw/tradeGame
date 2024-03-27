import { isUndefined } from "lodash-es";
import { PropsWithChildren, useMemo, useState } from "react";
import styled from "styled-components";

import { LoadingBar } from "@Components/LoadingBar";
import { Grid, Row } from "@Components/grid";
import { TogglePager } from "@Components/togglePager";
import { ShippingPlanExchange } from "@Services/GameState/tables/ShippingPlan/ShippingPlanExchange";
import { Translations } from "@Services/GameState/tables/Translations";
import { Item } from "@Services/GameState/tables/common";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { categorySelectorElements } from "../CityData/Vehicle/cityVehiclesInventory";
import { PlannerTransferItem } from "./PlannerTransferItem";

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

export function ShippingPlanner({
  inventory,
  aWeight,
  bWeight,
  aCapacity,
  children,
  bCapacity,
  plan,
}: PropsWithChildren<{
  inventory?: Map<number, (ShippingPlanExchange & Item & Translations)[]>;
  aWeight?: number;
  bWeight?: number;
  aCapacity?: number;
  bCapacity?: number;
  plan: ID;
}>) {
  const [inCategory, setInCategory] = useState<number>(0);

  const items = useMemo(() => {
    if (inventory && inventory.has(inCategory)) {
      return inventory
        .get(inCategory)!
        .map(({ translation, ID, number }) => (
          <PlannerTransferItem
            plan={plan}
            item={ID}
            label={translation}
            key={ID}
            number={number}
          />
        ));
    }
    return false;
  }, [inventory, inCategory, plan]);

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
}
