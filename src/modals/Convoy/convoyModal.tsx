import { ChangeEventHandler, useEffect, useState } from "react";

import { Button } from "@Components/button";
import { GridItem } from "@Components/grid";
import { Input, Select } from "@Components/input";
import { Label } from "@Components/label";
import { Link } from "@Components/terminalScreen";
import { Screen } from "@Components/terminalScreen";
import { useCurrentConvoy } from "@Hooks/index";
import { useDBValue } from "@Hooks/index";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  CreateConvoy,
  getConvoylessVehicles,
  getConvoys,
} from "@Services/GameState/tables/Convoy/convoyQueries";
import { addVehicleToConvoy } from "@Services/GameState/tables/Vehicle/vehiclesQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import Modal from "../Modal";
import { ConvoyInfo } from "./convoyInfo";

export const ConvoyItem = ({
  icon,
  name,
  id,
}: {
  name: string;
  icon?: string;
  id: ID;
}) => {
  const [, setCurrentConvoy] = useCurrentConvoy();

  const onClick = () => {
    setCurrentConvoy(id);
  };

  return (
    <div>
      <Link onClick={onClick}>
        {icon}
        {name}
      </Link>
    </div>
  );
};

const Header = <Label type="painted">Convoys</Label>;

const Footer = (
  <div>
    {/*<Button onClick={() => setSelectedPage(CityModalSubPages.warehouse)}>Warehouse</Button>*/}
  </div>
);

export const ConvoyModal = () => {
  const [currentConvoy] = useCurrentConvoy();

  const convoysData = useDBValue(getConvoys, [DBEvents.convoyUpdated]);

  const availableCommandVehicles = useDBValue(getConvoylessVehicles, [
    DBEvents.convoyUpdated,
  ]);

  useEffect(() => {
    if (availableCommandVehicles && availableCommandVehicles?.length > 0) {
      const { ID, name } = availableCommandVehicles[0];

      setNewConvoyData({
        commandVehicle: ID,
        name: `Convoy ${name}`,
      });
    }
  }, [availableCommandVehicles]);

  const [newConvoyData, setNewConvoyData] = useState<{
    name: string;
    commandVehicle: number | null;
  }>({ name: "", commandVehicle: null });

  const setNewConvoyName: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value: name },
  }) => {
    setNewConvoyData((old) => ({ ...old, name }));
  };

  const setCommandVehicle: ChangeEventHandler<HTMLSelectElement> = ({
    target: { value },
  }) => {
    setNewConvoyData((old) => ({
      ...old,
      commandVehicle: Number.parseInt(value),
    }));
  };

  const onCreate = () => {
    const { commandVehicle } = newConvoyData;

    if (commandVehicle) {
      CreateConvoy(newConvoyData.name).then((id) => {
        id && addVehicleToConvoy(id, commandVehicle);
      });
    }
  };

  const body = !currentConvoy ? (
    <>
      <Screen style={{ height: "50%" }}>
        {convoysData?.map(({ ID, name }) => (
          <ConvoyItem id={ID} key={ID} name={name} />
        ))}
      </Screen>
      <div style={{ height: "50%" }}>
        <GridItem $col={1} $row={1}>
          <Label style={{ flex: 1 }} type="painted">
            Name
          </Label>
          <Input
            style={{ flex: 1 }}
            min={0}
            value={newConvoyData.name}
            type={"input"}
            onChange={setNewConvoyName}
          />
        </GridItem>
        <GridItem $col={1} $row={1}>
          <Label style={{ flex: 1 }} type="painted">
            Command vehicle
          </Label>
          <Select style={{ flex: 1 }} onSelect={setCommandVehicle}>
            {availableCommandVehicles?.map(({ ID, name }) => (
              <option key={ID} value={ID}>
                {name}
              </option>
            ))}
          </Select>
        </GridItem>
        <Button onClick={onCreate}>Create</Button>
      </div>
    </>
  ) : (
    <ConvoyInfo />
  );

  return <Modal header={Header} body={body} footer={Footer} />;
};
