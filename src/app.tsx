import { useEffect, useRef, useState } from "react";
import { WorldMap } from "./screens/worldMap/worldMap/worldMap";
import { GameState, GameStateContext } from "@Services/GameState/gameState";
import { message } from "@tauri-apps/api/dialog";
import DebugModeContext from "./debugModeContext";
import { ContextMenu } from "./components/ContextMenu";
import { GameLoop } from "@Components/hooks/useGameLoop";

export default function App(): JSX.Element {
  const [gameLoaded, setGameLoaded] = useState(false);
  const gameLoopCleanup = useRef<() => void>();

  useEffect(() => {
    GameState.init()
      .then(() => {
        setGameLoaded(true);
        gameLoopCleanup.current = GameLoop(GameState);
      })
      .catch((err) => message(`A problem has happened ${JSON.stringify(err)}`));

    return () => {
      gameLoopCleanup.current && gameLoopCleanup.current();
    };
  }, []);

  return (
    <GameStateContext.Provider value={GameState}>
      <DebugModeContext.Provider value={true}>
        {gameLoaded ? <WorldMap /> : <>...Loading</>}
        <ContextMenu />
      </DebugModeContext.Provider>
    </GameStateContext.Provider>
  );
}
