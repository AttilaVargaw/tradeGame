import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CreateConvoy,
  getConvoylessVehicles,
  getConvoys,
} from "@Services/GameState/tables/Convoy/convoyQueries";
import { Input, Select } from "@Components/input";

import { Button } from "@Components/button";
import { ConvoyData } from "@Services/GameState/tables/Convoy/Convoy";
import { ConvoyInfo } from "./convoyInfo";
import { GridItem } from "@Components/grid";
import { ID } from "@Services/GameState/dbTypes";
import { Label } from "@Components/label";
import { Link } from "@Components/terminalScreen";
import Modal from "../Modal";
import { Screen } from "@Components/terminalScreen";
import { VehicleData } from "@Services/GameState/tables/Vehicle/Vehicle";
import { addVehicleToConvoy } from "@Services/GameState/tables/Vehicle/vehiclesQueries";
import { dbObservable } from "@Services/GameState/gameState";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";

/*enum ConvoyModalSubpages {
  list,
  info,
}*/

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

  const onClick = useCallback(() => {
    setCurrentConvoy(id);
  }, [setCurrentConvoy, id]);

  return (
    <div>
      <Link onClick={onClick}>
        {icon}
        {name}
      </Link>
    </div>
  );
};

const Header = (
  <Label type="led" style={{ width: "100%" }}>
    Convoys
  </Label>
);

const Footer = (
  <div>
    {/*<Button onClick={() => setSelectedPage(CityModalSubPages.warehouse)}>Warehouse</Button>*/}
  </div>
);

export const ConvoyModal = () => {
  const [convoysData, setConvoyData] = useState<ConvoyData[]>([]);
  const [currentConvoy] = useCurrentConvoy();
  const [availableCommandVehicles, setAvailableCommandVehicles] = useState<
    VehicleData[]
  >([]);

  useEffect(() => {
    getConvoys().then(setConvoyData);
    getConvoylessVehicles().then((commandVehicles) => {
      setAvailableCommandVehicles(commandVehicles);
      if (commandVehicles.length > 0) {
        const { ID, name } = commandVehicles[0];

        setNewConvoyData({
          commandVehicle: ID,
          name: `Convoy ${name}`,
        });
      }
    });
  }, []);

  useEffect(() => {
    const subscription = dbObservable.subscribe(() =>
      getConvoys().then(setConvoyData)
    );

    return () => subscription.unsubscribe();
  }, []);

  const [newConvoyData, setNewConvoyData] = useState<{
    name: string;
    commandVehicle: number | null;
  }>({ name: "", commandVehicle: null });

  const setNewConvoyName = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(({ currentTarget: { value: name } }) => {
    setNewConvoyData((old) => ({ ...old, name }));
  }, []);

  const setCommandVehicle = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ target: { value } }) => {
      setNewConvoyData((old) => ({
        ...old,
        commandVehicle: Number.parseInt(value),
      }));
    },
    []
  );

  const onCreate = useCallback(() => {
    const { commandVehicle } = newConvoyData;

    if (commandVehicle) {
      CreateConvoy(newConvoyData.name).then((id) => {
        addVehicleToConvoy(id, commandVehicle);
      });
    }
  }, [newConvoyData]);

  const body = useMemo(() => {
    if (!currentConvoy) {
      return (
        <>
          <Screen style={{ height: "50%" }}>
            {convoysData.map(({ ID, name }) => (
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
                {availableCommandVehicles.map(({ ID, name }) => (
                  <option key={ID} value={ID}>
                    {name}
                  </option>
                ))}
              </Select>
            </GridItem>
            <Button onClick={onCreate}>Create</Button>
          </div>
        </>
      );
    } else {
      console.log("convinfo", currentConvoy);
      return <ConvoyInfo />;
    }
  }, [
    currentConvoy,
    convoysData,
    newConvoyData.name,
    setNewConvoyName,
    setCommandVehicle,
    availableCommandVehicles,
    onCreate,
  ]);

  return <Modal header={Header} body={body} footer={Footer} />;
};
