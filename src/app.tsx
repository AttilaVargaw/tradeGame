import { useEffect, useRef, useState } from "react";
import { WorldMap } from "./screens/worldMap/worldMap/worldMap";

import { message } from "@tauri-apps/api/dialog";
import DebugModeContext from "./debugModeContext";
import { ContextMenu } from "./components/ContextMenu";
import { GameLoop } from "@Components/hooks/useGameLoop";
import { init } from "@Services/GameState/gameState";

export default function App(): JSX.Element {
  const [gameLoaded, setGameLoaded] = useState(false);
  const gameLoopCleanup = useRef<() => void>();

  useEffect(() => {
    init()
      .then(() => {
        setGameLoaded(true);
        gameLoopCleanup.current = GameLoop();
      })
      .catch((err) => message(`A problem has happened ${JSON.stringify(err)}`));

    return () => {
      gameLoopCleanup.current?.();
    };
  }, []);

  return (
    <DebugModeContext.Provider value={true}>
      {gameLoaded ? <WorldMap /> : <>...Loading</>}
      <ContextMenu />
    </DebugModeContext.Provider>
  );
}
