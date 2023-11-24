import { useEffect, useState } from "react";
import styled from "styled-components";

import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { Label } from "@Components/label";
import { DBEvents, InventoryItem } from "@Services/GameState/dbTypes";
import { dbObservable } from "@Services/GameState/gameState";
import {
  getAllItems,
  moveBetweenInventories,
} from "@Services/GameState/queries/inventory";

import { WarehouseTransferItem } from "../../../components/WarehouseTransferItem";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  margin-top: 1em;
`;

export function CityVehiclesInventory() {
  const [items, setItems] = useState<{
    [Key: string]: InventoryItem[];
  }>();
  const [categories, setCategories] = useState<number>(0);
  const [cityID] = useCurrentSelectedCity();

  useEffect(() => {
    typeof cityID?.inventory !== "undefined" &&
      getAllItems(cityID.inventory).then(setItems);

    const subscription = dbObservable.subscribe((event) => {
      if (event.type === DBEvents.inventoryUpdate && cityID) {
        getAllItems(cityID.inventory).then(setItems);
      }
    });

    return () => subscription.unsubscribe();
  }, [categories, cityID]);

  return (
    <Container>
      <div></div>
      <Label type="painted">City</Label>
      <div></div>
      <Label type="led">test2</Label>
      {items?.[categories].map(
        ({ nameKey, translation, itemID, ID, number }) => (
          <WarehouseTransferItem
            interchange={moveBetweenInventories}
            aID={0}
            bID={0}
            aNum={number}
            bNum={0}
            label={translation}
            key={nameKey}
          />
        )
      )}
    </Container>
  );
}
