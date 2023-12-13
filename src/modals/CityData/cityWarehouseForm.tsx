import { unionBy } from "lodash-es";
import { useCallback, useContext, useMemo, useState } from "react";

import { LoadingBar } from "@Components/LoadingBar";
import { Row } from "@Components/grid";
import { useCurrentSelectedCity } from "@Hooks/index";
import { useDBValue } from "@Hooks/index";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  getEntityInventory,
  getEntityInventoryWeight,
} from "@Services/GameState/queries/inventory";
import { getCityRequiredItemsWithQuantity } from "@Services/GameState/tables/City/cityQueries";

import { WarehouseRow } from "../../components/WarehouseRow";
import debugModeContext from "../../debugModeContext";

const updateEvents = [DBEvents.inventoryUpdate];

export default function CityWarehouseForm() {
  const debugMode = useContext(debugModeContext);

  const [cityData] = useCurrentSelectedCity();

  const [categories, setCategories] = useState<number>(0);

  const items = useDBValue(
    useCallback(
      () => getCityRequiredItemsWithQuantity(cityData?.ID),
      [cityData]
    ),
    updateEvents
  );

  const items2 = useDBValue(
    useCallback(() => getEntityInventory(cityData?.inventory), [cityData]),
    updateEvents
  );

  const weight = useDBValue(
    useCallback(
      () => getEntityInventoryWeight(cityData?.inventory),
      [cityData?.inventory]
    ),
    updateEvents
  );

  const items3 = useMemo(() => {
    return unionBy(
      [items2, items].reduce((prev, item4) => {
        return [...prev, ...(item4?.values() ?? [])];
      }, []),
      (item) => item
    );
  }, [categories, items, items2]);

  return (
    <Row>
      {/*<div style={{ flex: 3 }}>
        {items3.map((item) =>
          item.map(({ number, ID, nameKey, translation }) => (
            <WarehouseRow
              key={ID}
              editable={debugMode}
              label={translation ?? nameKey}
              number={number}
              direction="row"
            />
          ))
        )}
          </div>*/}
      <div style={{ flex: 1 }}>
        <LoadingBar
          percent={
            weight?.weight && weight.weight !== 0
              ? (weight.weight / 10000) * 100
              : 0
          }
        />
      </div>
    </Row>
  );
}
