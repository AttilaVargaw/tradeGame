import { Link, Screen } from "@Components/terminalScreen";
import { useEffect, useState } from "react";

import { VehicleData } from "@Services/GameState/tables/Vehicle/Vehicle";
import { getVehicles } from "@Services/GameState/tables/Vehicle/vehiclesQueries";

export const VehicleListModal = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);

  useEffect(() => {
    getVehicles().then(setVehicles);
  }, []);

  return (
    <Screen style={{ height: "50%" }}>
      {vehicles.map(({ name, ID }) => (
        <div key={ID}>
          <Link>{name}</Link>
        </div>
      ))}
    </Screen>
  );
};
