
import { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export const currentConvoySubject = new BehaviorSubject<number | null>(null);

export const currentConvoyObservable = currentConvoySubject.asObservable();

export function useCurrentConvoy() {
  const [convoyID, setConvoyID] = useState<number | null>(null);

  useEffect(() => {
    const subscribtion = currentConvoyObservable.subscribe(setConvoyID);

    return () => subscribtion.unsubscribe();
  }, []);

  return [convoyID, setConvoyID] as [
    number | null,
    React.Dispatch<React.SetStateAction<number | null>>
  ];
}
