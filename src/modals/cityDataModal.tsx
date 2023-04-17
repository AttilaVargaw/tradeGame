import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Modal from "react-bootstrap/esm/Modal";
import { City } from "Services/GameState/dbTypes";
import { GameStateContext } from "Services/GameState/gameState";
import { SelectedCityContext } from "../screens/worldMap/selectedCityContext";
import CityIndustry from "./cityIndustry";
import CityPopulation from "./cityPopulation";
import CityWarehouseForm from "./cityWarehouseForm";

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
  const cityID = useContext(SelectedCityContext);
  const gameState = useContext(GameStateContext);

  const [cityData, setCityData] = useState<City>();

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
        <Modal.Header closeButton>
          <Modal.Title>{cityData.name}</Modal.Title>
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
