import { useCallback, useContext } from "react";

import { LoadingBar } from "@Components/LoadingBar";
import { Row } from "@Components/grid";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useDBValue } from "@Components/hooks/useDBValue";
import { getEntityInventoryWeight } from "@Services/GameState/queries/inventory";
import { getCityRequiredItemsWithQuantity } from "@Services/GameState/tables/City/cityQueries";

import { WarehouseRow } from "../../components/WarehouseRow";
import debugModeContext from "../../debugModeContext";

export default function CityWarehouseForm() {
  const debugMode = useContext(debugModeContext);

  const [cityData] = useCurrentSelectedCity();

  const items = useDBValue(
    useCallback(() => getCityRequiredItemsWithQuantity(cityData?.ID), [cityData])
  );

  const weight = useDBValue(
    useCallback(
      () => getEntityInventoryWeight(cityData?.inventory),
      [cityData?.inventory]
    )
  );

  return (
    <Row>
      <div style={{ flex: 3 }}>
        {items?.[0]?.map(({ number, ID, nameKey }) => (
          <WarehouseRow
            key={ID}
            editable={debugMode}
            label={nameKey}
            number={number}
            direction="row"
          />
        ))}
      </div>
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
