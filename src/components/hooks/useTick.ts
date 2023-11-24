import { BehaviorSubject } from "rxjs";
import { useEffect } from "react";

export const Tick = new BehaviorSubject(new Date(1899, 1, 1).getTime());
export const TickSpeed = new BehaviorSubject(1);

const startTick = new Date(1899, 1, 1).getTime();
//let prevTick = Date.now();
const currentTick = startTick;
const interval = 0;
