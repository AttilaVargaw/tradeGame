import { useContext, useEffect, useState } from "react";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/esm/Modal";
import Row from "react-bootstrap/esm/Row";
import { TradeRouteProps } from "Services/GameState/dbTypes";
import { GameStateContext } from "Services/GameState/gameState";
import { SelectedTradeRouteContext } from "../screens/worldMap/selectedTradeRouteContext";

export default function TradeRouteModal({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose?: () => void;
}): JSX.Element {
  const routeID = useContext(SelectedTradeRouteContext);
  const gameState = useContext(GameStateContext);

  const [routeData, setRouteData] = useState<TradeRouteProps>();

  useEffect(() => {
    if (routeID) {
      gameState.getTradeRoute(routeID).then(setRouteData);
    }
  }, [routeID, gameState]);

  if (routeData) {
    return (
      <Modal show={isOpen} onHide={onRequestClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{routeData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          <Container>
            <Row>Convoys on this route</Row>
          </Container>
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
            {/*<Button onClick={() => setSelectedPage(CityModalSubPages.warehouse)}>Warehouse</Button>*/}
          </ButtonGroup>
        </Container>
      </Modal>
    );
  } else {
    return <></>;
  }
}
