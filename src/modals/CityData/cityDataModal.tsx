import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Modal from "react-bootstrap/esm/Modal";
import { GameStateContext } from "@Services/GameState/gameState";
import CityIndustry from "./cityIndustry";
import CityPopulation from "./cityPopulation";
import CityWarehouseForm from "./cityWarehouseForm";
import { Label } from "@Components/label";
import { Button } from "@Components/button";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { CityEntity } from "@Services/GameState/tables/City";

enum CityModalSubPages {
  popularity,
  population,
  industry,
  warehouse,
}

export default function CityDataModal({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose?: () => void;
}): JSX.Element | null {
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
      <Modal show={isOpen} onHide={onRequestClose} size="xl">
        <Modal.Header>
          <Label type="led" style={{ width: "100%" }}>
            {`< ${cityData.name} >`}
          </Label>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          {selectedPage === CityModalSubPages.population &&
            cityData.fullPopulation > 0 && <CityPopulation />}
          {selectedPage === CityModalSubPages.industry && cityData.industry && (
            <CityIndustry />
          )}
          {selectedPage === CityModalSubPages.warehouse && (
            <CityWarehouseForm />
          )}
        </Modal.Body>
        <Container>
          <ButtonGroup
            as={Col}
            style={{
              width: "100%",
              position: "relative",
              margin: "auto",
              left: 0,
              right: 0,
              paddingTop: "1em",
              paddingBottom: "1em",
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
            >
              Relations
            </Button>
            <Button
              active={selectedPage === CityModalSubPages.industry}
              onClick={() => setSelectedPage(CityModalSubPages.industry)}
            >
              Industry
            </Button>
            {cityData.fullPopulation > 0 && (
              <Button
                active={selectedPage === CityModalSubPages.population}
                onClick={() => setSelectedPage(CityModalSubPages.population)}
              >
                Population
              </Button>
            )}
          </ButtonGroup>
        </Container>
      </Modal>
    );
  } else {
    return null;
  }
}
