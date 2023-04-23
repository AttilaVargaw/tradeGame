import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import { GameStateContext } from "@Services/GameState/gameState";
import { Input, Select } from "@Components/input";
import { Label } from "@Components/label";
import { Button } from "@Components/button";
import Modal from "../Modal";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { Screen } from "@Components/terminalScreen";
import { Link } from "@Components/terminalScreen";
import { Row } from "@Components/grid";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { ConvoyInfo } from "./convoyInfo";

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
  id: number;
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

function Header() {
  return (
    <Label type="led" style={{ width: "100%" }}>
      Convoys
    </Label>
  );
}

function Footer() {
  return (
    <Container>
      <ButtonGroup
        as={Col}
        style={{
          width: "100%",
          position: "relative",
          margin: "auto",
          left: 0,
          right: 0,
          paddingTop: "1em",
          paddingBottom: "1em",
        }}
      >
        {/*<Button onClick={() => setSelectedPage(CityModalSubPages.warehouse)}>Warehouse</Button>*/}
      </ButtonGroup>
    </Container>
  );
}

export const ConvoyModal = () => {
  const gameState = useContext(GameStateContext);

  const [convoysData, setConvoyData] = useState<ConvoyData[]>([]);
  const [currentConvoy] = useCurrentConvoy();
  const [availableCommandVehicles, setAvailableCommandVehicles] = useState<
    VehicleData[]
  >([]);
  useEffect(() => {
    gameState.getConvoys().then(setConvoyData);
    gameState.getConvoylessVehicles().then((commandVehicles) => {
      setAvailableCommandVehicles(commandVehicles);
      if (commandVehicles.length > 0) {
        const { ID, name } = commandVehicles[0];

        setNewConvoyData({
          commandVehicle: ID,
          name: `Convoy ${name}`,
        });
      }
    });
  }, [gameState]);

  useEffect(() => {
    const subscription = gameState.dbObservable.subscribe(() =>
      gameState.getConvoys().then(setConvoyData)
    );

    return () => subscription.unsubscribe();
  }, [gameState]);

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
      gameState.CreateConvoy(newConvoyData.name).then((id) => {
        gameState.addVehicleToConvoy(id, commandVehicle);
      });
    }
  }, [gameState, newConvoyData]);

  const body = useCallback(() => {
    if (!currentConvoy) {
      return (
        <>
          <Screen style={{ height: "50%" }}>
            {convoysData.map(({ ID, name }) => (
              <ConvoyItem id={ID} key={ID} name={name} />
            ))}
          </Screen>
          <Container style={{ height: "50%" }}>
            <Form>
              <Row>
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
              </Row>
              <Row>
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
              </Row>
              <Button onClick={onCreate}>Create</Button>
            </Form>
          </Container>
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
