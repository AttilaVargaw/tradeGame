import React, { useState } from "react";

import { Label, LoadingBar, Router, TogglePager } from "@Components/index";
import { PagerProps } from "@Components/pagerProps";
import { useCurrentSelectedCity, useDBValue } from "@Hooks/index";
import { getCity } from "@Services/GameState/tables/City/cityQueries";

import Modal from "../Modal";
import CityVehicles from "./Vehicle/cityVehicles";
import CityIndustry from "./cityIndustry";
import CityPersonel from "./cityPersonel";
import CityPopulation from "./cityPopulation";
import CityWarehouseForm from "./cityWarehouseForm";

enum CityModalSubPages {
  relations,
  population,
  industry,
  warehouse,
  personel,
  vehicles,
}

const subPages = {
  1: <CityPopulation />,
  2: <CityIndustry />,
  3: <CityWarehouseForm />,
  4: <CityPersonel />,
  5: <CityVehicles />,
  0: (
    <div>
      <p>test</p>
      <LoadingBar percent={20}></LoadingBar>
    </div>
  ),
} as { [key in CityModalSubPages]: React.ReactElement };

const pagerPages = [
  {
    label: "Warehouse",
    value: CityModalSubPages.warehouse,
  },
  {
    label: "Personel",
    value: CityModalSubPages.personel,
  },
  {
    label: "Relations",
    value: CityModalSubPages.relations,
  },
  {
    label: "Industry",
    value: CityModalSubPages.industry,
  },
  {
    label: "Vehicles",
    value: CityModalSubPages.vehicles,
  },
  {
    label: "Population",
    value: CityModalSubPages.population,
  },
] as PagerProps<CityModalSubPages>["values"];

export default function CityDataModal(): React.ReactElement | boolean {
  const [cityID] = useCurrentSelectedCity();

  const [selectedPage, setSelectedPage] = useState<CityModalSubPages>(
    CityModalSubPages.population
  );

  const cityData = useDBValue(() => getCity(cityID?.ID));

  const body = (() => {
    if (!cityData) {
      return false;
    }

    return <Router pages={subPages} value={selectedPage} />;
  })();

  const footer = !!cityData && (
    <TogglePager
      selected={selectedPage}
      onChange={setSelectedPage}
      values={pagerPages}
    />
  );

  const header = !!cityData && (
    <div style={{ width: "100%" }}>
      <Label type="led">{`< ${cityData.name} >`}</Label>
    </div>
  );

  return !!cityData && <Modal header={header} body={body} footer={footer} />;
}
