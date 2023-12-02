import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { LoadingBar } from "@Components/LoadingBar";
import { Row } from "@Components/grid";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useCurrentSelectedConvoyAtom } from "@Components/hooks/useCurrentSelectedConvoy";
import { useDBValue } from "@Components/hooks/useDBValue";
import { Label } from "@Components/label";
import { Pager } from "@Components/pager";
import { PagerProps } from "@Components/pagerProps";
import { DBEvents, InventoryItem } from "@Services/GameState/dbTypes";
import {
  getEntityInventoryWeight,
  getNumberOfInventoryItem,
  moveBetweenInventories,
} from "@Services/GameState/queries/inventory";
import { getCityRequiredItemsWithQuantity } from "@Services/GameState/tables/City/cityQueries";
import { getVehiclesOfConvoy } from "@Services/GameState/tables/Convoy/convoyQueries";

import { WarehouseTransferItem } from "../../../components/WarehouseTransferItem";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  margin-top: 1em;
`;

const updateEvents = [DBEvents.inventoryUpdate];

export function CityVehiclesInventory() {
  const [categories, setCategories] = useState<number>(0);

  const [cityData] = useCurrentSelectedCity();

  const [currentConvoy] = useCurrentSelectedConvoyAtom();

  const cityItems = useDBValue(
    useCallback(
      () => getCityRequiredItemsWithQuantity(cityData?.ID),
      [cityData?.ID]
    ),
    updateEvents
  );

  const [currentGoal, setCurrentGoal] = useState<number>(-1);

  const [vehicleItems, setVehicleItems] = useState<
    Record<number, InventoryItem[]>
  >({ 0: [] });

  useEffect(() => {
    if (cityItems) {
      Promise.all(
        cityItems[categories]?.map((item) =>
          getNumberOfInventoryItem(currentGoal, item.item)
        )
      ).then((values) =>
        setVehicleItems({
          0: cityItems[0]?.map((item, index) => ({
            ...item,
            number: values[index].number ?? 0,
          })),
        })
      );
    }
  }, [categories, cityItems, currentGoal]);

  const cityInventoryWeight = useDBValue(
    useCallback(
      () => getEntityInventoryWeight(cityData?.inventory),
      [cityData?.inventory]
    ),
    updateEvents
  );

  const vehicleInventoryWeight = useDBValue(
    useCallback(() => getEntityInventoryWeight(currentGoal), [currentGoal]),
    updateEvents
  );

  const vehicles = useDBValue(
    useCallback(
      () => getVehiclesOfConvoy(currentConvoy?.ID),
      [currentConvoy?.ID]
    ),
    updateEvents
  );

  const goals = useMemo(
    () =>
      [
        { label: currentConvoy?.name ?? "", value: -1 },
        ...(vehicles
          ? vehicles.map((vehicle) => ({
              label: vehicle.name,
              value: vehicle.inventory,
            }))
          : []),
      ] as PagerProps<number>["values"],
    [currentConvoy?.name, vehicles]
  );

  return (
    <Row style={{ gap: "1em" }}>
      <div style={{ flex: 1, marginTop: "1em" }}>
        <LoadingBar
          percent={
            cityInventoryWeight?.weight
              ? (cityInventoryWeight.weight / 10000) * 100
              : 0
          }
        />
      </div>
      <Container>
        <div />
        <Label type="painted">City</Label>
        <div />
        <Pager onChange={setCurrentGoal} values={goals} />
        {cityData &&
          cityItems?.[categories]?.map(({ nameKey, number, item }) => (
            <WarehouseTransferItem
              interchange={moveBetweenInventories}
              aID={cityData.inventory}
              bID={currentGoal}
              aNum={number}
              bNum={
                vehicleItems?.[categories]?.find(({ ID }) => ID === item)
                  ?.number ?? 0
              }
              label={nameKey}
              key={nameKey}
            />
          ))}
      </Container>
      <div style={{ flex: 1, marginTop: "1em" }}>
        <LoadingBar
          percent={
            vehicleInventoryWeight?.weight
              ? (vehicleInventoryWeight.weight / 10000) * 100
              : 0
          }
        />
      </div>
    </Row>
  );
}
