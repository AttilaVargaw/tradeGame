import { isUndefined } from "lodash-es";
import { PropsWithChildren, useMemo, useState } from "react";
import { styled } from "styled-components";

import { ItemsByCategory } from "@Services/GameState/queries/inventory";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { categorySelectorElements } from "../modals/CityData/Vehicle/cityVehiclesInventory";
import { LoadingBar } from "./LoadingBar";
import { WarehouseTransferItem } from "./WarehouseTransferItem";
import { Row } from "./grid";
import { TogglePager } from "./togglePager";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
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

export function InventoryExchange({
  aInventory,
  bInventory,
  aId,
  bId,
  moveFn,
  aWeight,
  bWeight,
  aCapacity,
  children,
  bCapacity,
}: PropsWithChildren<{
  aInventory: ItemsByCategory;
  bInventory: ItemsByCategory;
  aId: ID;
  bId: ID;
  moveFn: MoveFunction;
  aWeight?: number;
  bWeight?: number;
  aCapacity?: number;
  bCapacity?: number;
}>) {
  const [inCategory, setInCategory] = useState<number>(0);

  const items = useMemo(() => {
    if (bInventory.has(inCategory)) {
      return bInventory
        .get(inCategory)
        ?.map(({ number, translation, ID }, index) => (
          <WarehouseTransferItem
            item={ID}
            interchange={moveFn}
            aID={aId}
            bID={bId}
            aNum={aInventory?.get(inCategory)?.[index]?.number ?? 0}
            bNum={number}
            label={translation}
            key={ID}
          />
        ));
    }
    return false;
  }, [aId, aInventory, bId, bInventory, inCategory, moveFn]);

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
          <Container>{items}</Container>
          <InventoryLoadingBar capacity={bCapacity} weight={bWeight} />
        </Row>
      )}
    </>
  );
}
