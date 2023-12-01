import { useCallback, useMemo, useState } from "react";

import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useDBValue } from "@Components/hooks/useDBValue";
import { Label } from "@Components/label";
import { PagerProps } from "@Components/pagerProps";
import { TogglePager } from "@Components/togglePager";
import { getCity } from "@Services/GameState/tables/City/cityQueries";

import Modal from "../Modal";
import CityVehicles from "./Vehicle/cityVehicles";
import CityIndustry from "./cityIndustry";
import CityPersonel from "./cityPersonel";
import CityPopulation from "./cityPopulation";
import CityWarehouseForm from "./cityWarehouseForm";

enum CityModalSubPages {
  popularity,
  population,
  industry,
  warehouse,
  personel,
  vehicles,
}

const pages = [
  {
    label: "Warehouse",
    value: CityModalSubPages.warehouse,
  },
  {
    label: "Relations",
    value: CityModalSubPages.industry,
  },
  {
    label: "Industry",
    value: CityModalSubPages.personel,
  },
  {
    label: "Vehicles",
    value: CityModalSubPages.vehicles,
  },
  {
    label: "Population",
    value: CityModalSubPages.population,
  },
  {
    label: "Popularity",
    value: CityModalSubPages.popularity,
  },
] as PagerProps<CityModalSubPages>["values"];

export default function CityDataModal(): JSX.Element | null {
  const [cityID] = useCurrentSelectedCity();

  const [selectedPage, setSelectedPage] = useState<CityModalSubPages>(
    CityModalSubPages.population
  );

  const cityData = useDBValue(useCallback(() => getCity(cityID?.ID), [cityID]));

  const body = useMemo(() => {
    if (!cityData) {
      return <></>;
    }

    switch (selectedPage) {
      case CityModalSubPages.population:
        return cityData.fullPopulation > 0 && <CityPopulation />;
      case CityModalSubPages.industry:
        return <CityIndustry />;
      case CityModalSubPages.warehouse:
        return <CityWarehouseForm />;
      case CityModalSubPages.personel:
        return <CityPersonel />;
      case CityModalSubPages.vehicles:
        return <CityVehicles />;
      case CityModalSubPages.popularity:
        return <></>;
      default:
        <></>;
    }

    return false;
  }, [cityData, selectedPage]);

  const footer = useMemo(
    () =>
      !!cityData && (
        <TogglePager
          selected={selectedPage}
          onChange={setSelectedPage}
          values={pages}
        />
      ),
    [cityData, selectedPage]
  );

  const header = useMemo(
    () =>
      !!cityData && (
        <div style={{ width: "100%" }}>
          <Label type="led">{`< ${cityData.name} >`}</Label>
        </div>
      ),
    [cityData]
  );

  if (cityData) {
    return <Modal header={header} body={body} footer={footer} />;
  } else {
    return null;
  }
}
