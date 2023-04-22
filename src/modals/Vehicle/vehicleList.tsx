import { FC, useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import { VehicleType } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import Button from "react-bootstrap/esm/Button";
import Placeholder from "@Components/placeholder";
import { VehicleData } from "@Services/GameState/tables/Vehicle";

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

export const VehicleListModal = () => {
  const gameState = useContext(GameStateContext);

  const [, setVehicles] = useState<VehicleData[]>([]);

  useEffect(() => {
    gameState.getVehicles().then(setVehicles);
  }, [gameState]);

  return <>Vehicle list</>;
};
