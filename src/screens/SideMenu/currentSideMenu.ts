import { BehaviorSubject } from "rxjs";

import { Subpages } from "./sideMenu";

export const currentSideMenuBehaviorSubject = new BehaviorSubject<
  keyof typeof Subpages
>("default");

export const currentSideMenuObservable =
  currentSideMenuBehaviorSubject.asObservable();
