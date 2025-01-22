import { BehaviorSubject, Subject } from "rxjs";

import { ConvoyAI } from "@Services/AI/convoy";
import { UpdateConvoys } from "@Services/GameState/tables/Convoy/convoyQueries";

export enum RedrawType {
  Convoys,
  Vehicles,
}
export const Tick = new BehaviorSubject(new Date(1899, 1, 1).getTime());
export const TickSpeed = new BehaviorSubject(1);

export const gameRedrawSubject = new Subject<RedrawType>();
export const gameRedrawDoneSubject = new Subject<RedrawType>();
const fpsCounter = document.getElementById("FPS")!;

const startTick = new Date(1899, 1, 1).getTime();
const updateFrequency = 30;

const convoyAI = ConvoyAI();

const debug = false;

export function GameLoop() {
  let gameLoopAnimationFrame: number;
  let oldTimeStamp = 0;
  let currentTick = startTick;

  async function gameLoop(timeStamp: number) {
    //const t = Date.now();
    const dMs = timeStamp - oldTimeStamp;
    const ds = dMs * 0.001;
    const fps = Math.round(1 / ds);

    if (debug) {
      fpsCounter.innerHTML = fps.toString();

      if (fps < 30) {
        fpsCounter.style.setProperty("color", "red");
      } else if (fps < 45) {
        fpsCounter.style.setProperty("color", "yellow");
      } else {
        fpsCounter.style.setProperty("color", "white");
      }
    }

    if (dMs >= updateFrequency) {
      oldTimeStamp = timeStamp;
      let updates: boolean[] = [];

      if (TickSpeed.value !== 0) {
        currentTick += dMs * 3600 * TickSpeed.value;

        Tick.next(currentTick);
      }
      for (let i = 0; i < TickSpeed.value; ++i) {
        updates = await UpdateConvoys(ds);
      }

      if (updates.some((value) => value === true)) {
        gameRedrawSubject.next(RedrawType.Convoys);
      }

      await convoyAI.Udpate();
    }

    gameLoopAnimationFrame = window.requestAnimationFrame(gameLoop);

    //if (Date.now() - t > 0)
    //("Used time in the update loop:", Date.now() - t);
  }
  gameLoopAnimationFrame = window.requestAnimationFrame(gameLoop);
  return () => cancelAnimationFrame(gameLoopAnimationFrame);
}
