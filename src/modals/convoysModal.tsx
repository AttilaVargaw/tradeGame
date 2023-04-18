import { useCallback, useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import Row from "react-bootstrap/esm/Row";
import { Convoy, Vehicle } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import { SelectedTradeRouteContext } from "../screens/worldMap/selectedTradeRouteContext";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { Input, Select } from "@Components/input";
import { Label } from "@Components/label";

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

export const ConvoyModal = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose?: () => void;
}) => {
  const routeID = useContext(SelectedTradeRouteContext);
  const gameState = useContext(GameStateContext);

  const [convoysData, setConvoyData] = useState<Convoy[]>([]);
  const [availableCommandVehicles, setAvailableCommandVehicles] = useState<
    Vehicle[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      gameState.getConvoys().then(setConvoyData);
      gameState.getConvoylessVehicles().then(setAvailableCommandVehicles);
      gameState.getConvoylessVehicles().then(console.log);
    }
  }, [gameState, isOpen]);

  const [newConvoyData, setNewConvoyData] = useState<{
    name: string;
    commandVehicle: string;
  }>({ name: "", commandVehicle: "" });

  const setNewConvoyName = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(({ currentTarget: { value: name } }) => {
    setNewConvoyData((old) => ({ ...old, name }));
  }, []);

  const setCommandVehicle = useCallback(
    ({
      target: { value: commandVehicle },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      setNewConvoyData((old) => ({ ...old, commandVehicle }));
    },
    []
  );

  return (
    <Modal show={isOpen} onHide={onRequestClose} size="xl">
      <Modal.Header>
        <Label type="led" style={{ width: "100%" }}>
          Convoys
        </Label>
      </Modal.Header>
      <Modal.Body style={{ height: "80vh" }}>
        <Container>
          {convoysData.map(({ ID, name, type }) => (
            <ConvoyItem key={ID} id={ID} name={name} />
          ))}
          <Form.Group
            as={Row}
            style={{ paddingTop: ".5em", paddingBottom: ".5em" }}
          >
            <Col sm="8"></Col>
          </Form.Group>
        </Container>
        <Container>
          <Form>
            <Form.Label>Create a new convoy</Form.Label>
            <FormGroup className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input
                min={0}
                value={newConvoyData.name}
                type={"input"}
                onChange={setNewConvoyName}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label type="painted">Command vehicle</Label>
              <Select onChange={setCommandVehicle}>
                {availableCommandVehicles.map(({ ID, name }) => (
                  <option key={ID} value={ID}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <Button>Create</Button>
          </Form>
        </Container>
      </Modal.Body>
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
    </Modal>
  );
};
