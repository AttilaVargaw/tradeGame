import { Context } from "react";
import { createContext } from "react";

export enum ModalIDs {
  Vehicle,
}

export type CurrentModalType = {
  // setCurrentModal: (modal: Modals) => void
};

export const CurrentModalSetter = createContext({} as CurrentModalType);

export const Modals = () => {};
