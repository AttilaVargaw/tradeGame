import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useDBValue } from "@Components/hooks/useDBValue";
import { Label } from "@Components/label";
import { Toggle } from "@Components/toggle";
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

const Footer = styled.div`
  width: 100%;
  display: grid;
  flex-direction: row;
  grid-auto-columns: 1fr;
  grid-template-columns: repeat(6, 1fr);
`;

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

  console.log(body);

  const footer = useMemo(
    () =>
      !!cityData && (
        <Footer>
          <Toggle
            active={selectedPage === CityModalSubPages.warehouse}
            onChange={() => setSelectedPage(CityModalSubPages.warehouse)}
          >
            Warehouse
          </Toggle>
          <Toggle
            active={selectedPage === CityModalSubPages.popularity}
            onChange={() => setSelectedPage(CityModalSubPages.popularity)}
            disabled
          >
            Relations
          </Toggle>
          <Toggle
            active={selectedPage === CityModalSubPages.industry}
            onChange={() => setSelectedPage(CityModalSubPages.industry)}
          >
            Industry
          </Toggle>
          <Toggle
            active={selectedPage === CityModalSubPages.personel}
            onChange={() => setSelectedPage(CityModalSubPages.personel)}
          >
            Personel
          </Toggle>
          {cityData.fullPopulation > 0 && (
            <Toggle
              active={selectedPage === CityModalSubPages.population}
              onChange={() => setSelectedPage(CityModalSubPages.population)}
            >
              Population
            </Toggle>
          )}
          <Toggle
            active={selectedPage === CityModalSubPages.vehicles}
            onChange={() => setSelectedPage(CityModalSubPages.vehicles)}
          >
            Vehicles
          </Toggle>
        </Footer>
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
