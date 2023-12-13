import { useEffect, useState } from "react";

import { DBEvents } from "@Services/GameState/dbTypes";
import { dbObservable } from "@Services/GameState/gameState";

import { useObservableValue } from "./useObservable";

export function useDBValue<T>(fn?: () => Promise<T>, events?: DBEvents[]) {
  const [value, setValue] = useState<T>();
  const event = useObservableValue(dbObservable);

  useEffect(() => {
    if (events?.some((ev) => ev === event?.type)) {
      fn?.().then(setValue);
    }
  }, [event, events, fn]);

  useEffect(() => {
    fn?.().then(setValue);
  }, [fn]);

  return value;
}
