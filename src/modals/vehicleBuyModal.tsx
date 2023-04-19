import { FC, useCallback, useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Modal from "react-bootstrap/esm/Modal";
import Row from "react-bootstrap/esm/Row";
import { VehicleType } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import Button from "react-bootstrap/esm/Button";
import CardGroup from "react-bootstrap/esm/CardGroup";
import Nav from "react-bootstrap/esm/Nav";
import Placeholder from "@Components/placeholder";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";

export const BuyItem: FC<VehicleType & { onClick: () => void }> = ({
  desc,
  name,
  price,
  onClick,
}) => {
  return (
    <Col className="mb-4">
      <Card className="h-100">
        <Card.Body>
          <div
            style={{
              justifyContent: "center",
              aspectRatio: 1,
              paddingBottom: "1em",
            }}
          >
            <Placeholder width="100%" height="100%" />
          </div>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle>{price.toFixed(2)} ℳ</Card.Subtitle>
          <Card.Text>{desc}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-grid gap-2">
          <Button onClick={onClick} variant="primary">
            Order
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export const OrderPage: FC<{ ID: number; onBack: () => void }> = ({
  ID,
  onBack,
}) => {
  const gameState = useContext(GameStateContext);

  const [vehicleDescription, setVehicleDescription] = useState<VehicleType>();

  const [, setCurrentModal] = useCurrentModal();

  useEffect(() => {
    gameState
      .getVehicleType(ID)
      .then((result) => setVehicleDescription(result[0]));
  }, [ID, gameState, setCurrentModal]);

  const onOrder = useCallback(() => {
    gameState.addVehicle(ID).then(console.log);
    setCurrentModal(null);
  }, [gameState, ID, setCurrentModal]);

  if (!vehicleDescription) {
    return <></>;
  }

  const { desc, name, price } = vehicleDescription;

  return (
    <Row className="no-gutters">
      <Col>
        <div style={{ aspectRatio: 1 }}>
          <Placeholder width="100%" height="100%" />
        </div>
      </Col>
      <Col>
        <Card className="h-100">
          <Card.Body as={Col}>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle>{price.toFixed(2)} ℳ</Card.Subtitle>
            <Card.Text>{desc}</Card.Text>
          </Card.Body>
          <Card.Footer className="d-grid gap-2">
            <Button onClick={onOrder} variant="primary">
              Order
            </Button>
            <Button onClick={onBack} variant="primary">
              Cancel
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export const VehicleBuyModal = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose?: () => void;
}) => {
  const gameState = useContext(GameStateContext);

  const [vehicleDescriptions, setVehicleDescriptions] = useState<VehicleType[]>(
    []
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState("air");
  const [currentVehicle, setCurrentVehicle] = useState<number | null>(null);
  const [, setCurrentModal] = useCurrentModal();

  useEffect(() => {
    gameState.getVehicleTypes(selectedVehicleType).then(setVehicleDescriptions);
  }, [selectedVehicleType, gameState]);

  const setVehicleType = useCallback(
    (type: string) => () => {
      setSelectedVehicleType(type);
    },
    []
  );

  const onOrderClick = useCallback(
    (ID: number) => () => {
      setCurrentVehicle(ID);
    },
    []
  );

  return (
    <Modal show={isOpen} onHide={onRequestClose} size="xl">
      <Modal.Header>
        {currentVehicle && (
          <Button
            size="lg"
            variant="light"
            onClick={() => setCurrentVehicle(null)}
          >
            &lt;
          </Button>
        )}
        <Modal.Title>Order a new vehicle</Modal.Title>
      </Modal.Header>
      {!currentVehicle && (
        <Modal.Body style={{ height: "80vh" }} className="overflow-auto">
          <Card>
            <Card.Header>
              <Nav variant="tabs" defaultActiveKey="#air">
                <Nav.Item>
                  <Nav.Link onClick={setVehicleType("air")} href="#air">
                    Air vehicles
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={setVehicleType("wheeled")} href="#wheeled">
                    Wheeled vehicles
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={setVehicleType("tracked")} href="#tracked">
                    Tracked vehicles
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <CardGroup className="row row-cols-1 row-cols-md-4">
                {vehicleDescriptions.map(({ ID, name, desc, price, type }) => (
                  <BuyItem
                    onClick={onOrderClick(ID)}
                    type={type}
                    key={ID}
                    desc={desc}
                    price={price}
                    ID={ID}
                    name={name}
                  />
                ))}
              </CardGroup>
            </Card.Body>
          </Card>
        </Modal.Body>
      )}
      {!!currentVehicle && (
        <Modal.Body style={{ height: "80vh" }} className="overflow-auto">
          <OrderPage
            onBack={() => setCurrentVehicle(null)}
            ID={currentVehicle}
          />
        </Modal.Body>
      )}
    </Modal>
  );
};
