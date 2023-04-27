import { GameStateContext } from "@Services/GameState/gameState";
import { useContext, useEffect, useRef } from "react";
import { Subject } from "rxjs";
import { Tick, TickSpeed } from "./useTick";
import { update } from "@Services/simpleQueryBuilder";

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

  useEffect(() => {
    async function gameLoop(timeStamp: number) {
      const secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      oldTimeStamp = timeStamp;

      let updates: boolean[] = [];

      if (tick.current && tick.current !== 0) {
        for (let i = 0; i < tick.current; ++i)
          updates = await gameState.UpdateConvoys(secondsPassed);
      }

      if (updates.some((value) => value === true)) {
        gameRedrawSubject.next(RedrawType.Convoys);
      }

      fpsCounter.innerHTML = Math.round(1 / secondsPassed).toString();

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
