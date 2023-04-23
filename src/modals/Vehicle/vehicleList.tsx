import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { Link, TerminalScreen } from "@Components/terminalScreen";

export const VehicleListModal = () => {
  const gameState = useContext(GameStateContext);

  const [vehicles, setVehicles] = useState<VehicleData[]>([]);

  useEffect(() => {
    gameState.getVehicles().then(setVehicles);
  }, [gameState]);

  return (
    <TerminalScreen>
      {vehicles.map(({ name, ID }) => (
        <Link key={ID}>{name}</Link>
      ))}
    </TerminalScreen>
  );
};
