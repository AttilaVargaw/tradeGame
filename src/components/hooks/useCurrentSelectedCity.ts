import { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export const currentCityObservable = new BehaviorSubject<number | null>(null);

export const currentSelectedCity = currentCityObservable.asObservable();

//export const setCurrentSelectedCity = currentCityObservable.next;

export function useCurrentSelectedCity() {
  const [cityID, setCityID] = useState<number | null>(null);

  useEffect(() => {
    const subscribtion = currentSelectedCity.subscribe(setCityID);

    return () => subscribtion.unsubscribe();
  }, []);

  return [cityID, setCityID] as [
    number | null,
    React.Dispatch<React.SetStateAction<number | null>>
  ];
}
