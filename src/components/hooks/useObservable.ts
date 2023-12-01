import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useObservableValue<T>(observable: Observable<T>) {
  const [state, setState] = useState<T>();

  useEffect(() => {
    const subscribtion = observable.subscribe(setState);

    return () => subscribtion.unsubscribe();
  }, [observable, state]);

  return state;
}
