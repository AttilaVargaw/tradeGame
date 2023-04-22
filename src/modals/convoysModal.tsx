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
import Row from "react-bootstrap/esm/Row";
import { GameStateContext } from "@Services/GameState/gameState";
import { Input, Select } from "@Components/input";
import { Label } from "@Components/label";
import { Button } from "@Components/button";
import Modal from "./Modal";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { ConvoyData } from "@Services/GameState/tables/Convoy";

export const ConvoyItem = ({
  icon,
  id,
  name,
  onClick,
}: {
  id: number;
  onClick?: () => void;
  name: string;
  icon?: string;
}) => {
  return (
    <div onClick={onClick}>
      {icon}
      {name}
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

  const body = useCallback(
    () => (
      <>
        <Container style={{ height: "50%" }}>
          {convoysData.map(({ ID, name }) => (
            <ConvoyItem key={ID} id={ID} name={name} />
          ))}
          <Form.Group
            as={Row}
            style={{ paddingTop: ".5em", paddingBottom: ".5em" }}
          >
            <Col sm="8" />
          </Form.Group>
        </Container>
        <Container style={{ height: "50%" }}>
          <Form>
            <Label type="painted">Name</Label>
            <Input
              min={0}
              value={newConvoyData.name}
              type={"input"}
              onChange={setNewConvoyName}
            />
            <Label type="painted">Command vehicle</Label>
            <Select onSelect={setCommandVehicle}>
              {availableCommandVehicles.map(({ ID, name }) => (
                <option key={ID} value={ID}>
                  {name}
                </option>
              ))}
            </Select>

            <Button onClick={onCreate}>Create</Button>
          </Form>
        </Container>
      </>
    ),
    [
      availableCommandVehicles,
      onCreate,
      setCommandVehicle,
      setNewConvoyName,
      convoysData,
      newConvoyData.name,
    ]
  );

  return <Modal header={Header} body={body} footer={Footer} />;
};
