import { useContext, useEffect, useState } from "react";

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

enum CityModalSubPages {
  popularity,
  population,
  industry,
  warehouse,
  personel,
}

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

  if (cityData) {
    return (
      <Modal
        header={() => (
          <div
            style={{ paddingLeft: "2em", paddingRight: "2em", width: "100%" }}
          >
            <Label type="led">{`< ${cityData.name} >`}</Label>
          </div>
        )}
        body={() => {
          return (
            <>
              {selectedPage === CityModalSubPages.population &&
                cityData.fullPopulation > 0 && <CityPopulation />}
              {selectedPage === CityModalSubPages.industry &&
                cityData.industry && <CityIndustry />}
              {selectedPage === CityModalSubPages.warehouse && (
                <CityWarehouseForm />
              )}
              {selectedPage === CityModalSubPages.personel && <CityPersonel />}
            </>
          );
        }}
        footer={() => (
          <div
            style={{
              width: "100%",
              margin: "1em",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Button
              active={selectedPage === CityModalSubPages.warehouse}
              onClick={() => setSelectedPage(CityModalSubPages.warehouse)}
            >
              Warehouse
            </Button>
            <Button
              active={selectedPage === CityModalSubPages.popularity}
              onClick={() => setSelectedPage(CityModalSubPages.popularity)}
              disabled
            >
              Relations
            </Button>
            <Button
              active={selectedPage === CityModalSubPages.industry}
              onClick={() => setSelectedPage(CityModalSubPages.industry)}
            >
              Industry
            </Button>
            <Button
              active={selectedPage === CityModalSubPages.personel}
              onClick={() => setSelectedPage(CityModalSubPages.personel)}
            >
              Personel
            </Button>
            {cityData.fullPopulation > 0 && (
              <Button
                active={selectedPage === CityModalSubPages.population}
                onClick={() => setSelectedPage(CityModalSubPages.population)}
              >
                Population
              </Button>
            )}
          </div>
        )}
      />
    );
  } else {
    return null;
  }
}
