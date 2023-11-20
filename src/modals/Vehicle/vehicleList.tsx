import { useEffect, useState } from "react";
import { getVehicles } from "@Services/GameState/gameState";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { Link, Screen } from "@Components/terminalScreen";

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
