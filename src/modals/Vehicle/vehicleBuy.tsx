import { FC, useCallback, useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { VehicleType } from "@Services/GameState/dbTypes";
import CardGroup from "react-bootstrap/esm/CardGroup";
import Placeholder from "@Components/placeholder";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { Button } from "@Components/button";
import { makeid } from "@Services/utils";
import { BuyItem } from "./buyItem";
import { addVehicle, getVehicleType, getVehicleTypes } from "@Services/GameState/gameState";

function GenerateVehicleName() {
  return `${makeid(3)}-${makeid(3)}`;
}

export const OrderPage: FC<{ ID: number; onBack: () => void }> = ({
  ID,
  onBack,
}) => {
  const [vehicleDescription, setVehicleDescription] = useState<VehicleType>();

  const [, setCurrentModal] = useCurrentModal();

  useEffect(() => {
    getVehicleType(ID).then((result) => setVehicleDescription(result[0]));
  }, [ID, setCurrentModal]);

  const onOrder = useCallback(() => {
    if (vehicleDescription) {
      addVehicle(
        ID,
        vehicleDescription.name + " " + GenerateVehicleName()
      ).then(console.log);
      //setCurrentModal();
    }
  }, [ID, vehicleDescription]);

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
  const [vehicleDescriptions, setVehicleDescriptions] = useState<VehicleType[]>(
    []
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState("air");
  const [currentVehicle, setCurrentVehicle] = useState<number | null>(null);

  useEffect(() => {
    getVehicleTypes(selectedVehicleType).then(setVehicleDescriptions);
  }, [selectedVehicleType]);

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
      {!currentVehicle && (
        <Card>
          <div
            style={{
              width: "100%",
              display: "grid",
              gridAutoColumns: "1fr",
              gridTemplateColumns: "repeat(6, 1fr)",
            }}
          >
            <Button onClick={setVehicleType("air")}>Helicopters</Button>
            <Button onClick={setVehicleType("air")}>Airships</Button>
            <Button onClick={setVehicleType("wheeled")}>
              Wheeled Transporters
            </Button>
            <Button onClick={setVehicleType("wheeled")}>Wheeled Escorts</Button>
            <Button onClick={setVehicleType("tracked")}>
              Tracked Transporters
            </Button>
            <Button onClick={setVehicleType("tracked")}>Tracked Escorts</Button>
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
