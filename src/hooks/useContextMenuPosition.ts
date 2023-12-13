import { BehaviorSubject } from "rxjs";

export const ContextMenuPosition = new BehaviorSubject<[number, number] | null>(
  null
);
