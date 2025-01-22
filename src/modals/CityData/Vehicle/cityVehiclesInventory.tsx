import { useCallback, useState } from "react";

import { InventoryExchange } from "@Components/InventoryExchange";
import { Row } from "@Components/grid";
import { Label } from "@Components/label";
import { Pager } from "@Components/pager";
import { PagerProps } from "@Components/pagerProps";
import {
  useCurrentSelectedCity,
  useCurrentSelectedConvoyAtom,
  useDBValue,
} from "@Hooks/index";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  getEntityInventoryWeight,
  getTwoInventoryCombo,
  moveBetweenInventories,
} from "@Services/GameState/queries/inventory";
import { getVehiclesOfConvoy } from "@Services/GameState/tables/Convoy/convoyQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

const updateEvents = [DBEvents.inventoryUpdate];

export function CityVehiclesInventory() {
  const [cityData] = useCurrentSelectedCity();

  const [currentConvoy] = useCurrentSelectedConvoyAtom();
  const [currentGoal, setCurrentGoal] = useState<ID>(-1);

  const items = useDBValue(
    useCallback(
      () => getTwoInventoryCombo(cityData?.inventory, currentGoal),
      [cityData?.inventory, currentGoal]
    ),
    updateEvents
  );

  const vehicles = useDBValue(
    useCallback(() => getVehiclesOfConvoy(currentConvoy?.ID), [currentConvoy]),
    updateEvents
  );

  const goals = [
    { label: currentConvoy?.name ?? "", value: -1 },
    ...(vehicles
      ? vehicles.map((vehicle) => ({
          label: vehicle.name,
          value: vehicle.inventory,
        }))
      : []),
  ] as PagerProps<number>["values"];

  const header = (
    <Row>
      <Label style={{ width: "100%" }} type="painted">
        City
      </Label>
      <Pager
        style={{ width: "100%" }}
        onChange={setCurrentGoal}
        values={goals}
        selected={currentGoal}
      />
    </Row>
  );

  const cityInventoryWeight = useDBValue(
    useCallback(
      () => getEntityInventoryWeight(cityData?.inventory),
      [cityData?.inventory]
    ),
    updateEvents
  );

  const vehicleInventoryWeight = useDBValue(
    useCallback(
      () =>
        currentGoal !== -1
          ? getEntityInventoryWeight(currentGoal)
          : Promise.resolve({ weight: 0 }),
      [currentGoal]
    ),
    updateEvents
  );

  return (
    items &&
    cityData && (
      <InventoryExchange
        aId={cityData?.inventory}
        bId={currentGoal}
        aInventory={items[0]}
        bInventory={items[1]}
        moveFn={moveBetweenInventories}
        aWeight={cityInventoryWeight?.weight}
        bWeight={vehicleInventoryWeight?.weight}
        aCapacity={10000}
        bCapacity={1000}
      >
        {header}
      </InventoryExchange>
    )
  );
}
