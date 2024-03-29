import { atom, useAtom } from "jotai";

const useCurrentShippingPlanRouteAtom = atom<number | null>(null);

export function useCurrentShippingPlanRoute() {
  return useAtom(useCurrentShippingPlanRouteAtom);
}
