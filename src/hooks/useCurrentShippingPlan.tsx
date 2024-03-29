import { atom, useAtom } from "jotai";

const currentShippingPlanAtom = atom<number | null>(null);

export function useCurrentShippingPlan() {
  return useAtom(currentShippingPlanAtom);
}
