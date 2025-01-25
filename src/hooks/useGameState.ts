import {} from "@tauri-apps/api";

import { useEffect, useRef } from "react";
import { useBoolean } from "usehooks-ts";

import { init } from "@Services/GameState/gameState";
import * as dialog from "@tauri-apps/plugin-dialog";

import { GameLoop } from "./useGameLoop";

export function useGameState() {
  const { setTrue: setGameLoaded, value: gameLoaded } = useBoolean(false);
  const gameLoopCleanup = useRef<() => void>(undefined);

  useEffect(() => {
    init()
      .then(() => {
        setGameLoaded();
        gameLoopCleanup.current = GameLoop();
      })
      .catch((err) =>
        dialog.message(`A problem has happened ${JSON.stringify(err)}`)
      );

    return () => {
      gameLoopCleanup.current?.();
    };
  }, [setGameLoaded]);

  return { gameLoaded };
}
