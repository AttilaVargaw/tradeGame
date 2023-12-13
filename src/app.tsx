import { GameErrorBoundary } from "@Components/index";
import { useGameState } from "@Hooks/index";

import { ContextMenu, LoadingPage } from "./components";
import DebugModeContext from "./debugModeContext";
import { WorldMap } from "./screens/worldMap/worldMap/worldMap";

export default function App(): React.ReactElement {
  const { gameLoaded } = useGameState();

  return (
    <GameErrorBoundary>
      <DebugModeContext.Provider value={true}>
        {gameLoaded ? <WorldMap /> : <LoadingPage />}
        <ContextMenu />
      </DebugModeContext.Provider>
    </GameErrorBoundary>
  );
}
