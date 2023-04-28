import { useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export const Tick = new BehaviorSubject(new Date(1899, 1, 1).getTime());
export const TickSpeed = new BehaviorSubject(1);

const startTick = new Date(1899, 1, 1).getTime();
//let prevTick = Date.now();
let currentTick = startTick;
let interval = 0;

