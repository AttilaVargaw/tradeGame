import { VehicleType } from "@Services/GameState/dbTypes";
import { FC } from "react";
import { Col, Card } from "react-bootstrap";
import { Screen } from "@Components/terminalScreen";
import Placeholder from "@Components/placeholder";
import { Button } from "@Components/button";

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
