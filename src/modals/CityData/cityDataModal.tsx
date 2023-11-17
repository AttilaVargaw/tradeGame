import { useContext, useEffect, useMemo, useState } from "react";

import { GameStateContext } from "@Services/GameState/gameState";
import CityIndustry from "./cityIndustry";
import CityPopulation from "./cityPopulation";
import CityWarehouseForm from "./cityWarehouseForm";
import { Label } from "@Components/label";
import { Button } from "@Components/button";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { CityEntity } from "@Services/GameState/tables/City";
import CityPersonel from "./cityPersonel";
import Modal from "../Modal";
import styled from "styled-components";
import CityVehicles from "./cityVehicles";

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
  grid-template-columns: repeat(5, 1fr);
`;

export default function CityDataModal(): JSX.Element | null {
  const [cityID] = useCurrentSelectedCity();
  const gameState = useContext(GameStateContext);

  const [cityData, setCityData] = useState<CityEntity>();

  const [selectedPage, setSelectedPage] = useState<CityModalSubPages>(
    CityModalSubPages.population
  );

  useEffect(() => {
    if (cityID) {
      gameState.getCity(cityID).then(setCityData);
    }
  }, [cityID, gameState]);

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
          <Button
            $active={selectedPage === CityModalSubPages.warehouse}
            onClick={() => setSelectedPage(CityModalSubPages.warehouse)}
          >
            Warehouse
          </Button>
          <Button
            $active={selectedPage === CityModalSubPages.popularity}
            onClick={() => setSelectedPage(CityModalSubPages.popularity)}
            disabled
          >
            Relations
          </Button>
          <Button
            $active={selectedPage === CityModalSubPages.industry}
            onClick={() => setSelectedPage(CityModalSubPages.industry)}
          >
            Industry
          </Button>
          <Button
            $active={selectedPage === CityModalSubPages.personel}
            onClick={() => setSelectedPage(CityModalSubPages.personel)}
          >
            Personel
          </Button>
          {cityData.fullPopulation > 0 && (
            <Button
              $active={selectedPage === CityModalSubPages.population}
              onClick={() => setSelectedPage(CityModalSubPages.population)}
            >
              Population
            </Button>
          )}
          <Button
            $active={selectedPage === CityModalSubPages.vehicles}
            onClick={() => setSelectedPage(CityModalSubPages.vehicles)}
          >
            Vehicles
          </Button>
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
