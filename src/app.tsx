import { GameErrorBoundary } from "@Components/GameErorrBoundary";
import { LoadingPage } from "@Components/LoadingPage";
import { useGameState } from "@Components/hooks/useGameState";

import { ContextMenu } from "./components/ContextMenu";
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
