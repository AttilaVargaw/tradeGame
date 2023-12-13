import { atom, useAtom } from "jotai";

const selectedRouteAtom = atom<number | null>(null);

export function useSelectedRouteAtom() {
  return useAtom(selectedRouteAtom);
}
