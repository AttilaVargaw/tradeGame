import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

import { CityEntity } from "@Services/GameState/tables/City/CityTable";

export const currentCityBehaviorSubject =
  new BehaviorSubject<CityEntity | null>(null);

export const currentSelectedCity = currentCityBehaviorSubject.asObservable();

//export const setCurrentSelectedCity = currentCityObservable.next;

export function useCurrentSelectedCity() {
  const [cityID, setCityID] = useState<CityEntity | null>(null);

  useEffect(() => {
    const subscribtion = currentSelectedCity.subscribe(setCityID);

    return () => subscribtion.unsubscribe();
  }, []);

  return [cityID, setCityID] as [
    CityEntity | null,
    React.Dispatch<React.SetStateAction<CityEntity | null>>
  ];
}
