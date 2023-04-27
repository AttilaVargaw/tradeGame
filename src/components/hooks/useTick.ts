import { useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export const Tick = new BehaviorSubject(new Date(1899, 1, 1).getTime());
export const TickSpeed = new BehaviorSubject(1);

const startTick = new Date(1899, 1, 1).getTime();
//let prevTick = Date.now();
let currentTick = startTick;
let interval = 0;

export function useTickUpdate() {
  useEffect(() => {
    TickSpeed.subscribe(() => {
      clearTimeout(interval);

      interval = window.setInterval(() => {
        if (TickSpeed.value !== 0) {
          //const now = Date.now();
          //const dT = now - prevTick;
          //prevTick = now;

          currentTick = 3600 * 1000 + currentTick;

          Tick.next(currentTick);
        }
      }, 1000 / TickSpeed.value);
    });

    return TickSpeed.unsubscribe;
  }, []);
}
