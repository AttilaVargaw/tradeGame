import { atom, useAtom } from "jotai";

const currentModalAtom = atom<number | null>(null);

export function useCurrentSelectedCity() {
  return useAtom(currentModalAtom);
}
