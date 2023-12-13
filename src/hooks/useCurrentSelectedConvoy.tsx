import { atom, useAtom } from "jotai";

import { ConvoyData } from "@Services/GameState/tables/Convoy/Convoy";

const currentSelectedConvoyAtom = atom<ConvoyData | null>(null);

export function useCurrentSelectedConvoyAtom() {
  return useAtom(currentSelectedConvoyAtom);
}
