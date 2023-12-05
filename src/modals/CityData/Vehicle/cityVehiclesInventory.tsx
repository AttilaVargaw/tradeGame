import { unionBy } from "lodash-es";
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
import {
  DBEvents,
  InventoryItem,
  Item,
  Translation,
} from "@Services/GameState/dbTypes";
import {
  getEntityInventory,
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

  const [currentGoal, setCurrentGoal] = useState<number>(-1);

  const vehicleItems = useDBValue(
    useCallback(() => getEntityInventory(currentGoal), [currentGoal]),
    updateEvents
  );

  const cityItems2 = useDBValue(
    useCallback(() => getEntityInventory(cityData?.ID), [cityData?.ID]),
    updateEvents
  );

  const [vehicleSideItems, setVehicleSideItems] = useState<
    Record<number, (Translation & Item & InventoryItem)[]>
  >([]);

  const cityItems = useDBValue(
    useCallback(async () => {
      const data = await getCityRequiredItemsWithQuantity(cityData?.ID);

      const items3 =
        vehicleItems &&
        (await Promise.all(
          vehicleItems?.map(async (item) => ({
            ...item,
            number: (
              await getNumberOfInventoryItem(cityData?.inventory, item.ID)
            ).number,
          }))
        ));

      return {
        0: unionBy(items3, cityItems2, data?.[categories], (item) => item.item),
      } as Record<number, (Translation & Item & InventoryItem)[]>;
    }, [
      categories,
      cityData?.ID,
      cityData?.inventory,
      cityItems2,
      vehicleItems,
    ]),
    updateEvents
  );

  useEffect(() => {
    if (cityItems?.[categories]) {
      currentGoal >= 0 &&
        Promise.all(
          cityItems[categories].map(async (item) =>
            getNumberOfInventoryItem(currentGoal, item.item)
          )
        ).then((values) => {
          !!values &&
            setVehicleSideItems({
              0: cityItems[categories].map((item, index) => ({
                ...item,
                number: values[index].number,
              })),
            });
        });
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

  const items = useMemo(
    () =>
      cityData &&
      vehicleSideItems?.[categories] &&
      cityItems?.[categories]?.map(
        ({ number, item, translation, ID }, index) => (
          <WarehouseTransferItem
            item={item}
            interchange={moveBetweenInventories}
            aID={cityData.inventory}
            bID={currentGoal}
            aNum={number}
            bNum={vehicleSideItems?.[categories]?.[index]?.number ?? 0}
            label={translation}
            key={ID}
          />
        )
      ),
    [categories, cityData, cityItems, currentGoal, vehicleSideItems]
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
        {items}
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
