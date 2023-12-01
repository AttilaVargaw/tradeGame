import { useCallback, useContext } from "react";

import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useDBValue } from "@Components/hooks/useDBValue";
import { getCityRequiredItemsWithQuantity } from "@Services/GameState/tables/City/cityQueries";

import { WarehouseRow } from "../../components/WarehouseRow";
import debugModeContext from "../../debugModeContext";

export default function CityWarehouseForm() {
  const debugMode = useContext(debugModeContext);

  const [cityID] = useCurrentSelectedCity();

  const items = useDBValue(
    useCallback(() => getCityRequiredItemsWithQuantity(cityID?.ID), [cityID])
  );

  return (
    <div>
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
  );
}
