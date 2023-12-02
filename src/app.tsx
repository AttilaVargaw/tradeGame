import { useEffect, useRef, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { Button } from "@Components/button";
import { GameLoop } from "@Components/hooks/useGameLoop";
import { Label } from "@Components/label";
import { init } from "@Services/GameState/gameState";
import { message } from "@tauri-apps/api/dialog";

import { ContextMenu } from "./components/ContextMenu";
import DebugModeContext from "./debugModeContext";
import Modal from "./modals/Modal";
import { WorldMap } from "./screens/worldMap/worldMap/worldMap";

function ErrorComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Modal
      body={<>{String(error)}</>}
      header={
        <Label color="red" type="painted">
          Error
        </Label>
      }
      footer={<Button onClick={resetErrorBoundary}>Retry</Button>}
      hideCloseButton
    />
  );
}

export default function App(): React.ReactElement {
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
    <ErrorBoundary FallbackComponent={ErrorComponent}>
      <DebugModeContext.Provider value={true}>
        {gameLoaded ? <WorldMap /> : <>...Loading</>}
        <ContextMenu />
      </DebugModeContext.Provider>
    </ErrorBoundary>
  );
}
