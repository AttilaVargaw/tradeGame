import { useEffect, useState } from "react";

import { DBEvents } from "@Services/GameState/dbTypes";
import { dbObservable } from "@Services/GameState/gameState";

export function useDBValue<T>(fn: () => Promise<T>, events?: DBEvents[]) {
  const [value, setValue] = useState<T | null>();

  useEffect(() => {
    fn().then(setValue);

    if (events) {
      const subscription = dbObservable.subscribe((e) => {
        if (events.some((ev) => ev === e.type)) {
          fn().then(setValue);
        }
      });

      return () => subscription.unsubscribe();
    }
    return;
  }, [events, fn]);

  return value;
}
