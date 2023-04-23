import { atom, useAtom } from "jotai";

const currentSelectedCitiesAtom = atom<[number | null, number | null]>([
  null,
  null,
]);

export function useCurrentSelectedCities() {
  return useAtom(currentSelectedCitiesAtom);
}
