import { useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export const Tick = new BehaviorSubject(new Date(1899, 1, 1).getTime());

const startTick = new Date(1899, 1, 1).getTime();
let prevTick = Date.now();
let currentTick = startTick;

export function useTickUpdate() {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const dT = now - prevTick;
      prevTick = now;

      currentTick = dT * 3600 + currentTick;

      Tick.next(currentTick);
    }, 1000);

    return () => clearTimeout(interval);
  }, []);
}
