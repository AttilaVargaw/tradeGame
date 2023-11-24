import { FC, useCallback, useEffect, useState } from "react";
import {
  addVehicle,
  getVehicleType,
  getVehicleTypes,
} from "@Services/GameState/tables/Vehicle/vehiclesQueries";

import { Button } from "@Components/button";
import { BuyItem } from "./buyItem";
import { ID } from "@Services/GameState/dbTypes";
import Placeholder from "@Components/placeholder";
import { VehicleType } from "@Services/GameState/dbTypes";
import { makeid } from "@Services/utils";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";

function GenerateVehicleName() {
  return `${makeid(3)}-${makeid(3)}`;
}

export const OrderPage: FC<{ ID: ID; onBack: () => void }> = ({
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
    <div>
      <div>
        <div style={{ aspectRatio: 1 }}>
          <Placeholder width="100px" height="100px" />
        </div>
      </div>
      <div>
        <div className="h-100">
          <div>
            <div>{name}</div>
            <div>{price.toFixed(2)} ℳ</div>
            <div>{desc}</div>
          </div>
          <div className="d-grid gap-2">
            <Button onClick={onOrder}>Order</Button>
            <Button onClick={onBack}>Back</Button>
          </div>
        </div>
      </div>
    </div>
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
    (ID: ID) => () => {
      setCurrentVehicle(ID);
    },
    []
  );

  return (
    <>
      {!currentVehicle && (
        <div>
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
          <div
            style={{
              width: "100%",
              display: "grid",
              gridAutoColumns: "1fr",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "1em",
              paddingTop: "1em",
            }}
          >
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
          </div>
        </div>
      )}
      {!!currentVehicle && (
        <OrderPage onBack={() => setCurrentVehicle(null)} ID={currentVehicle} />
      )}
    </>
  );
};
