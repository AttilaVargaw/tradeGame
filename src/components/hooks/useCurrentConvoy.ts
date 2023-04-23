import { atom, useAtom } from "jotai";

const currentConvoyAtom = atom<number | null>(null);

export function useCurrentConvoy() {
  return useAtom(currentConvoyAtom);
}
