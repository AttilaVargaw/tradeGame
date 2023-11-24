import { atom, useAtom } from "jotai";

export type Modal =
  | "cityInfo"
  | "convoys"
  | "vehicle"
  | "tradeRoute"
  | "encyclopedia"
  | "convoyTradeRoute"
  | null;

const currentModalAtom = atom<Modal>(null);

export function useCurrentModal() {
  return useAtom(currentModalAtom);
}
