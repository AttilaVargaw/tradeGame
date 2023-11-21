import { useEffect, useMemo, useState } from "react";

import CityIndustry from "./cityIndustry";
import CityPopulation from "./cityPopulation";
import CityWarehouseForm from "./cityWarehouseForm";
import { Label } from "@Components/label";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { CityEntity } from "@Services/GameState/tables/City";
import CityPersonel from "./cityPersonel";
import Modal from "../Modal";
import styled from "styled-components";
import CityVehicles from "./Vehicle/cityVehicles";
import { Toggle } from "@Components/toggle";
import { getCity } from "@Services/GameState/gameState";

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

  const [cityData, setCityData] = useState<CityEntity>();

  const [selectedPage, setSelectedPage] = useState<CityModalSubPages>(
    CityModalSubPages.population
  );

  useEffect(() => {
    cityID && getCity(cityID).then(setCityData);
  }, [cityID]);

  const body = useMemo(
    () =>
      cityData && (
        <>
          {selectedPage === CityModalSubPages.population &&
            cityData.fullPopulation > 0 && <CityPopulation />}
          {selectedPage === CityModalSubPages.industry && cityData.industry && (
            <CityIndustry />
          )}
          {selectedPage === CityModalSubPages.warehouse && (
            <CityWarehouseForm />
          )}
          {selectedPage === CityModalSubPages.personel && <CityPersonel />}
          {selectedPage === CityModalSubPages.vehicles && <CityVehicles />}
        </>
      ),
    [cityData, selectedPage]
  );

  const footer = useMemo(
    () =>
      cityData && (
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
      cityData && (
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
