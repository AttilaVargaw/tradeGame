import { Label } from "@Components/label";
import styled from "styled-components";
import { ItemTranswerRow } from "./warehouseItem";
import { useEffect, useState } from "react";
import { Item } from "@Services/GameState/dbTypes";
import { getAllItems } from "@Services/GameState/gameState";
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
  const [categories, setCategories] = useState<number>(1);

  useEffect(() => {
    getAllItems().then(setItems);
  }, []);

  return (
    <Container>
      <div></div>
      <Label type="painted">City</Label>
      <div></div>
      <Label type="led">test2</Label>
      {items?.[categories].map(({ nameKey, translation }) => (
        <ItemTranswerRow interchange={() => undefined} aID={0} bID={0} aNum={0} bNum={0} label={translation} key={nameKey} />
      ))}
    </Container>
  );
}
