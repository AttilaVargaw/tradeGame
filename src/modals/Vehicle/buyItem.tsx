import { FC } from "react";

import { Button } from "@Components/button";
import Placeholder from "@Components/placeholder";
import { Screen } from "@Components/terminalScreen";
import { VehicleType } from "@Services/GameState/tables/vehicleTypes";

export const BuyItem: FC<VehicleType & { onClick: () => void }> = ({
  desc,
  name,
  price,
  onClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
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
      </div>
      <div className="d-grid gap-2">
        <Button onClick={onClick}>Order</Button>
      </div>
    </div>
  );
};
