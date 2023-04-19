import { atom, useAtom } from "jotai";

export type Modal = "cityInfo" | "convoys" | "buyVehicle" | "tradeRoute" | null;

const currentModalAtom = atom<Modal>(null);

export function useCurrentModal() {
  return useAtom(currentModalAtom);
}
