import { BehaviorSubject } from "rxjs";

import { Subpages } from "./subpages";

export const currentSideMenuBehaviorSubject = new BehaviorSubject<
  keyof typeof Subpages
>("default");

export const currentSideMenuObservable =
  currentSideMenuBehaviorSubject.asObservable();
