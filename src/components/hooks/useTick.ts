import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const tickAtom = atom<number>(new Date().setFullYear(1899, 1, 1));

const dT = 1000 * 60;

export function useTick() {
  return useAtom(tickAtom);
}

export function useTickUpdater() {
  const [, setTick] = useTick();

  useEffect(() => {
    const timeout = setInterval(() => {
      setTick((tick) => tick + dT);
    }, 1000);

    return () => clearInterval(timeout);
  }, [setTick]);
}
