import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { Link, Screen } from "@Components/terminalScreen";

export const VehicleListModal = () => {
  const gameState = useContext(GameStateContext);

  const [vehicles, setVehicles] = useState<VehicleData[]>([]);

  useEffect(() => {
    gameState.getVehicles().then(setVehicles);
  }, [gameState]);

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
