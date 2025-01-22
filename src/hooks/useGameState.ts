import { useEffect, useRef, useState } from "react";

import { init } from "@Services/GameState/gameState";
import {  } from "@tauri-apps/api";

import { GameLoop } from "./useGameLoop";
import * as dialog from "@tauri-apps/plugin-dialog"

export function useGameState() {
  const [gameLoaded, setGameLoaded] = useState(false);
  const gameLoopCleanup = useRef<() => void>();

  useEffect(() => {
    init()
      .then(() => {
        setGameLoaded(true);
        gameLoopCleanup.current = GameLoop();
      })
      .catch((err) =>
        dialog.message(`A problem has happened ${JSON.stringify(err)}`)
      );

    return () => {
      gameLoopCleanup.current?.();
    };
  }, []);

  return { gameLoaded };
}
