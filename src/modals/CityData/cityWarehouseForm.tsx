import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { Item, WarehouseItem } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import debugModeContext from "../../debugModeContext";
import { Button } from "@Components/button";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";

export default function CityWarehouseForm() {
  const debugMode = useContext(debugModeContext);
  const {
    updateCityWarehouseItem,
    getNotAvailableItems,
    getCityWarehouse,
    addCityWarehouseItem,
  } = useContext(GameStateContext);

  const [cityID, ] = useCurrentSelectedCity()

  const [add, setAdd] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<{ ID?: number; number: number }>({
    ID: undefined,
    number: 0,
  });
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>([]);

  useEffect(() => {
    if (cityID) {
      getNotAvailableItems(cityID).then((items) => {
        setItems(items);
        setNewItem({
          ID: items.length > 0 ? items[0].ID : undefined,
          number: 0,
        });
      });
      getCityWarehouse(cityID).then(setWarehouse);
    }
  }, [cityID, getCityWarehouse, getNotAvailableItems]);

  const addItem = useCallback(async () => {
    if (newItem.ID && cityID) {
      await addCityWarehouseItem(newItem.ID, newItem.number, cityID);

      await Promise.all([
        await getNotAvailableItems(cityID),
        await getCityWarehouse(cityID),
      ]).then(([notAmiableItems, cityWarehouse]) => {
        setItems(notAmiableItems);
        setWarehouse(cityWarehouse);
        setNewItem({
          ID: notAmiableItems.length > 0 ? notAmiableItems[0].ID : undefined,
          number: 0,
        });
      });

      setAdd(false);
    }
  }, [
    newItem,
    addCityWarehouseItem,
    cityID,
    getCityWarehouse,
    getNotAvailableItems,
  ]);

  const setNewItemNumber = useCallback(
    ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
      setNewItem((old) => ({ ...old, number: Number.parseFloat(value) }));
    },
    []
  );

  const selectNewItem = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ currentTarget: { value: ID } }) => {
      setNewItem((old) => ({ ...old, ID: Number.parseInt(ID) }));
    },
    []
  );

  const updateItemNumber = useCallback(
    (ID: number) =>
      async ({
        currentTarget: { value },
      }: React.ChangeEvent<HTMLInputElement>) => {
        if (cityID) {
          await updateCityWarehouseItem(Number(value), ID);
          await getCityWarehouse(cityID).then(setWarehouse);
        }
      },
    [cityID, updateCityWarehouseItem, getCityWarehouse]
  );

  return (
    <Container>
      <Row>
        <h2>Warehouse</h2>
      </Row>
      {warehouse.map(({ number, ID, nameKey }) =>
        debugMode ? (
          <Form.Group
            key={ID}
            as={Row}
            style={{ paddingTop: ".5em", paddingBottom: ".5em" }}
          >
            <Form.Label sm="4" column>
              {nameKey}
            </Form.Label>
            <Col sm="8">
              <Form.Control
                min={0}
                value={number}
                type={"number"}
                onChange={updateItemNumber(ID)}
              />
            </Col>
          </Form.Group>
        ) : (
          <Row key={ID}>
            <h3>{nameKey}</h3> <p>{number}</p>
          </Row>
        )
      )}
      {debugMode && add && items.length !== 0 && (
        <Form.Group as={Row}>
          <Col sm="4">
            <Form.Select onChange={selectNewItem}>
              {items.map(({ ID, nameKey }) => (
                <option key={ID} value={ID}>
                  {nameKey}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Control
              value={newItem.number}
              type="number"
              min={1}
              onChange={setNewItemNumber}
            />
          </Col>
          <Col sm="2">
            <Button
              style={{ width: "100%" }}
              disabled={!!newItem.ID || newItem.number === 0}
              onClick={addItem}
            >
              Add
            </Button>
          </Col>
        </Form.Group>
      )}
      {debugMode && (
        <div style={{ marginTop: "1em" }}>
          <Button
            disabled={items.length === 0 && add}
            style={{ width: "100%" }}
            onClick={() => setAdd(!add)}
          >
            {add ? "close" : "+"}
          </Button>
        </div>
      )}
    </Container>
  );
}
