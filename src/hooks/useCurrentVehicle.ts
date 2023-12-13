import { atom, useAtom } from "jotai";

const currentVehicleAtom = atom<number | null>(null);

export function useCurrentVehicle() {
  return useAtom(currentVehicleAtom);
}
