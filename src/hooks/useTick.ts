import { BehaviorSubject } from "rxjs";

const startTick = new Date(1899, 1, 1).getTime();

export const Tick = new BehaviorSubject(startTick);
export const TickSpeed = new BehaviorSubject(1);
