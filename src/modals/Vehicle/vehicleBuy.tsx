import { FC, useCallback, useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { VehicleType } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import CardGroup from "react-bootstrap/esm/CardGroup";
import Placeholder from "@Components/placeholder";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { Button } from "@Components/button";
import { makeid } from "@Services/utils";
import { Screen } from "@Components/terminalScreen";

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
          <Screen>
            <h1>{name}</h1>
            <h2>{price.toFixed(2)} ℳ</h2>
            <p>{desc}</p>
          </Screen>
        </Card.Body>
        <Card.Footer className="d-grid gap-2">
          <Button onClick={onClick}>Order</Button>
        </Card.Footer>
      </Card>
    </Col>
  );
};

function GenerateVehicleName() {
  return `${makeid(3)}-${makeid(3)}`;
}

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
    if (vehicleDescription) {
      gameState
        .addVehicle(ID, vehicleDescription.name + " " + GenerateVehicleName())
        .then(console.log);
      //setCurrentModal();
    }
  }, [gameState, ID, vehicleDescription]);

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
            <Button onClick={onOrder}>Order</Button>
            <Button onClick={onBack}>Back</Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export const VehicleBuyModal = () => {
  const gameState = useContext(GameStateContext);

  const [vehicleDescriptions, setVehicleDescriptions] = useState<VehicleType[]>(
    []
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState("air");
  const [currentVehicle, setCurrentVehicle] = useState<number | null>(null);

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
    <>
      {currentVehicle && (
        <Button onClick={() => setCurrentVehicle(null)}>&lt;</Button>
      )}
      {!currentVehicle && (
        <Card>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={setVehicleType("air")}>Air vehicles</Button>
            <Button onClick={setVehicleType("wheeled")}>
              Wheeled vehicles
            </Button>

            <Button onClick={setVehicleType("tracked")}>
              Tracked vehicles
            </Button>
          </div>
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
      )}
      {!!currentVehicle && (
        <OrderPage onBack={() => setCurrentVehicle(null)} ID={currentVehicle} />
      )}
    </>
  );
};
