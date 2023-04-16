import { useEffect, useState } from "react";
import { WorldMap } from "./screens/worldMap/worldMap";
import { GameState, GameStateContext } from "Services/GameState/gameState";
import { message } from "@tauri-apps/api/dialog";
import DebugModeContext from "./debugModeContext";
import { ContextMenu } from "./components/ContextMenu";
import { run as holderRun } from "holderjs";

export default function App(): JSX.Element {
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    GameState.init()
      .then(() => {
        setGameLoaded(true);
      })
      .catch((err) => message(`A problem has happened ${JSON.stringify(err)}`));
  }, []);

  useEffect(() => {
    holderRun();
  });

  return (
    <GameStateContext.Provider value={GameState}>
      <DebugModeContext.Provider value={true}>
        {gameLoaded ? <WorldMap /> : <>...Loading</>}
        <ContextMenu />
      </DebugModeContext.Provider>
    </GameStateContext.Provider>
  );
}
