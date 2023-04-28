import { GameStateContext } from "@Services/GameState/gameState";
import { useContext, useEffect, useRef } from "react";
import { BehaviorSubject, Subject } from "rxjs";

export enum RedrawType {
  Convoys,
}
export const Tick = new BehaviorSubject(new Date(1899, 1, 1).getTime());
export const TickSpeed = new BehaviorSubject(1);

export const gameRedrawSubject = new Subject<RedrawType>();
export const gameRedrawDoneSubject = new Subject<RedrawType>();
const fpsCounter = document.getElementById("FPS")!;

const startTick = new Date(1899, 1, 1).getTime();
const updateFrequency = 50;

export function useGameLoop() {
  const gameState = useContext(GameStateContext);

  const gameLoopAnimationFrame = useRef<number>();
  const tick = useRef<number>();

  const oldTimeStamp = useRef(0);
  const currentTick = useRef(startTick);

  useEffect(() => {
    async function gameLoop(timeStamp: number) {
      const dMs = timeStamp - oldTimeStamp.current;
      const ds = dMs * 0.001;
      const fps = Math.round(1 / ds);
      fpsCounter.innerHTML = fps.toString();

      if (fps < 30) {
        fpsCounter.style.setProperty("color", "red");
      } else if (fps < 45) {
        fpsCounter.style.setProperty("color", "yellow");
      } else {
        fpsCounter.style.setProperty("color", "white");
      }

      if (dMs >= updateFrequency) {
        oldTimeStamp.current = timeStamp;
        let updates: boolean[] = [];

        if (TickSpeed.value !== 0) {
          currentTick.current += dMs * 3600 * TickSpeed.value;

          Tick.next(currentTick.current);
        }

        for (let i = 0; i < TickSpeed.value; ++i) {
          updates = await gameState.UpdateConvoys(ds);
        }

        if (updates.some((value) => value === true)) {
          gameRedrawSubject.next(RedrawType.Convoys);
        }
      }
      gameLoopAnimationFrame.current = window.requestAnimationFrame(gameLoop);
    }

    gameLoopAnimationFrame.current = window.requestAnimationFrame(gameLoop);

    return () => {
      console.log("redraw");
      window.cancelAnimationFrame(gameLoopAnimationFrame.current!);
    };
  }, [gameState]);
}
