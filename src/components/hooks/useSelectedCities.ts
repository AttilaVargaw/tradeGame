import { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export type Cities = [number | null, number | null];

export const currentCitiesObservable = new BehaviorSubject<Cities>([null, null]);

export const currentSelectedCities = currentCitiesObservable.asObservable();

//export const setCurrentSelectedCities = currentCitiesObservable.next;

export function useCurrentSelectedCities() {
  const [citiesID, setCitiesID] = useState<Cities>([null, null]);

  useEffect(() => {
    const subscribtion = currentSelectedCities.subscribe(setCitiesID);

    return () => subscribtion.unsubscribe();
  }, []);

  return [citiesID, setCitiesID] as [
    Cities,
    React.Dispatch<React.SetStateAction<Cities>>
  ];
}
