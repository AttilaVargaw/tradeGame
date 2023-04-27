import { GameStateContext } from "@Services/GameState/gameState";
import { useContext, useEffect, useRef } from "react";
import { Subject, async } from "rxjs";
import { TickSpeed } from "./useTick";

let oldTimeStamp = 0;

export enum RedrawType {
  Convoys,
}

export const gameRedrawSubject = new Subject<RedrawType>();
export const gameRedrawDoneSubject = new Subject<RedrawType>();
const fpsCounter = document.getElementById("FPS")!;

export function useGameLoop() {
  const gameState = useContext(GameStateContext);

  const gameLoopAnimationFrame = useRef<number>();
  const tick = useRef<number>();

  const prewFps = useRef<number>();
  const couner = useRef(0);
  const fpsSum = useRef(0);
  const fpsAvg = useRef(0);

  useEffect(() => {
    async function gameLoop(timeStamp: number) {
      const secondsPassed = (timeStamp - oldTimeStamp) * 0.001;
      oldTimeStamp = timeStamp;

      let updates: boolean[] = [];

      if (tick.current && tick.current !== 0) {
        for (let i = 0; i < tick.current; ++i)
          updates = await gameState.UpdateConvoys(secondsPassed);
      }

      if (updates.some((value) => value === true)) {
        gameRedrawSubject.next(RedrawType.Convoys);
      }

      const fps = Math.round(1 / secondsPassed);

      if (couner.current === 60) {
        couner.current = 0;
        fpsAvg.current = fpsSum.current / 60;
        fpsSum.current = 0;
      } else {
        ++couner.current;
        fpsSum.current += fps;
      }

      if (prewFps.current !== fps) {
        prewFps.current = fpsAvg.current;
        if (fpsAvg.current < 30) {
          fpsCounter.style.setProperty("color", "red");
        } else if (fpsAvg.current < 45) {
          fpsCounter.style.setProperty("color", "yellow");
        } else {
          fpsCounter.style.setProperty("color", "white");
        }
        fpsCounter.innerHTML = Math.round(fpsAvg.current).toString();
      }

      gameLoopAnimationFrame.current = window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);

    const tickSpeedSubscription = TickSpeed.subscribe(
      (newValue) => (tick.current = newValue)
    );

    return () => {
      window.cancelAnimationFrame(gameLoopAnimationFrame.current!);
      tickSpeedSubscription.unsubscribe();
    };
  }, [gameState]);
}
