import { useMemo } from "react";

import { InventoryExchange, MoveFunction } from "@Components/InventoryExchange";
import { Label } from "@Components/label";
import { useCurrentConvoy } from "@Hooks/index";
import { useDBValue } from "@Hooks/index";
import { getAllItems } from "@Services/GameState/queries/inventory";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import Modal from "../Modal";

function Header() {
  return <Label type="painted">Shipping Planner</Label>;
}

const changePlan: MoveFunction = (async (
  inventoryAID: ID,
  inventoryBID: ID,
  amount: number,
  item: ID
) => {
  return;
}) as MoveFunction;

export function ShippingPlannerModal() {
  const allItems = useDBValue(getAllItems);
  const [currentConvoy] = useCurrentConvoy();

  const body = useMemo(() => {
    return (
      !!currentConvoy && (
        <InventoryExchange
          aId={0}
          moveFn={changePlan}
          bId={currentConvoy}
          aInventory={new Map()}
          bInventory={new Map()}
        />
      )
    );
  }, [currentConvoy]);

  const footer = useMemo(() => <></>, []);

  return <Modal body={body} footer={footer} header={<Header />} />;
}
