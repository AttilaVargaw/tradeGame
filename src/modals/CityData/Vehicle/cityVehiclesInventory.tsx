import { Label } from "@Components/label";
import styled from "styled-components";
import { ItemTranswerRow } from "../warehouseItem";
import { useEffect, useState } from "react";
import { DBEvents, Item } from "@Services/GameState/dbTypes";
import {
  dbObservable,
  getAllItems,
  getEntityInventory,
  moveBetweenInventories,
} from "@Services/GameState/gameState";
import { Translations } from "@Services/GameState/tables/Translations";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  margin-top: 1em;
`;

export function CityVehiclesInventory() {
  const [items, setItems] = useState<{
    [Key: string]: (Item & Translations)[];
  }>();
  const [categories, setCategories] = useState<number>(0);

  useEffect(() => {
    // getEntityInventory().then(setItems);

    const subscription = dbObservable.subscribe((event) => {
      if (event.type === DBEvents.inventoryUpdate) {
        getAllItems().then(setItems);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Container>
      <div></div>
      <Label type="painted">City</Label>
      <div></div>
      <Label type="led">test2</Label>
      {items?.[categories].map(({ nameKey, translation }) => (
        <ItemTranswerRow
          interchange={moveBetweenInventories}
          aID={0}
          bID={0}
          aNum={0}
          bNum={0}
          label={translation}
          key={nameKey}
        />
      ))}
    </Container>
  );
}
