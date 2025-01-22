import { FC, useEffect, useState } from "react";

import { Button } from "@Components/button";
import { Grid } from "@Components/grid";
import { PagerProps } from "@Components/pagerProps";
import Placeholder from "@Components/placeholder";
import { TogglePager } from "@Components/togglePager";
import { useCurrentModal } from "@Hooks/index";
import {
  addVehicle,
  getVehicleType,
  getVehicleTypes,
} from "@Services/GameState/tables/Vehicle/vehiclesQueries";
import { VehicleType } from "@Services/GameState/tables/vehicleTypes";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";
import { makeid } from "@Services/utils";

import { BuyItem } from "./buyItem";

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

  const onOrder = () => {
    if (vehicleDescription) {
      addVehicle(
        ID,
        vehicleDescription.name + " " + GenerateVehicleName()
      ).then(console.log);
      //setCurrentModal();
    }
  };

  if (!vehicleDescription) {
    return false;
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

const toggleValues = [
  {
    value: "air",
    label: "Helicopters",
  },
  {
    value: "airships",
    label: "Airships",
  },
  {
    value: "wheeled",
    label: "Wheeled Escorts",
  },
  {
    value: "tracked",
    label: "Tracked Escorts",
  },
] as PagerProps<string>["values"];

export const VehicleBuyModal = () => {
  const [vehicleDescriptions, setVehicleDescriptions] = useState<VehicleType[]>(
    []
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState("air");
  const [currentVehicle, setCurrentVehicle] = useState<number | null>(null);

  useEffect(() => {
    getVehicleTypes(selectedVehicleType).then(setVehicleDescriptions);
  }, [selectedVehicleType]);

  const setVehicleType = (type: string) => () => {
    setSelectedVehicleType(type);
  };

  const onOrderClick = (ID: ID) => () => {
    setCurrentVehicle(ID);
  };

  return (
    <>
      {!currentVehicle && (
        <div>
          <TogglePager
            values={toggleValues}
            onChange={setSelectedVehicleType}
            selected={selectedVehicleType}
          />
          <Grid $num={8} style={{ gap: "1em", paddingTop: "1em" }}>
            {vehicleDescriptions.map((vehicle) => (
              <BuyItem
                onClick={onOrderClick(vehicle.ID)}
                {...vehicle}
                key={vehicle.ID}
              />
            ))}
          </Grid>
        </div>
      )}
      {!!currentVehicle && (
        <OrderPage onBack={() => setCurrentVehicle(null)} ID={currentVehicle} />
      )}
    </>
  );
};
