import {} from "lodash-es";

import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useCurrentSelectedConvoyAtom } from "@Components/hooks/useCurrentSelectedConvoy";
import { useDBValue } from "@Components/hooks/useDBValue";
import { Label } from "@Components/label";
import { Pager } from "@Components/pager";
import { DBEvents, InventoryItem } from "@Services/GameState/dbTypes";
import { moveBetweenInventories } from "@Services/GameState/queries/inventory";
import { getCityRequiredItemsWithQuantity } from "@Services/GameState/tables/City/cityQueries";

import { WarehouseTransferItem } from "../../../components/WarehouseTransferItem";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  margin-top: 1em;
`;

export function CityVehiclesInventory() {
  const [vehicleItems, setVehicleItems] = useState<{
    [Key: string]: InventoryItem[];
  }>();

  const [categories, setCategories] = useState<number>(0);

  const [cityID] = useCurrentSelectedCity();

  const [currentConvoy, setCurrentConvoy] = useCurrentSelectedConvoyAtom();

  const cityItems = useDBValue(
    useCallback(
      () => getCityRequiredItemsWithQuantity(cityID?.ID),
      [cityID?.ID]
    ),
    useMemo(() => [DBEvents.inventoryUpdate], [])
  );

  const goals = useMemo(
    () => ["All", currentConvoy?.name ?? ""],
    [currentConvoy?.name]
  );

  const [currentGoal, setCurrentGoal] = useState("");

  return (
    <Container>
      <div></div>
      <Label type="painted">City</Label>
      <div></div>
      <Pager onChange={setCurrentGoal} pages={goals} />
      {cityID &&
        cityItems?.[categories]?.map(({ nameKey, number }) => (
          <WarehouseTransferItem
            interchange={moveBetweenInventories}
            aID={cityID.inventory}
            bID={1}
            aNum={number}
            bNum={0}
            label={nameKey}
            key={nameKey}
          />
        ))}
    </Container>
  );
}
