import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ID, InventoryItem } from "@Services/GameState/dbTypes";
import { Input, Select } from "@Components/input";
import {
  addCityWarehouseItem,
  getEntityInventory,
  getNotAvailableItems,
  updateInventoryItem,
} from "@Services/GameState/queries/inventory";

import { Button } from "@Components/button";
import { Item } from "@Services/GameState/dbTypes";
import { WarehouseRow } from "../../components/WarehouseRow";
import debugModeContext from "../../debugModeContext";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";

export default function CityWarehouseForm() {
  const debugMode = useContext(debugModeContext);

  const [cityID] = useCurrentSelectedCity();

  const [add, setAdd] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<{ ID?: number; number: number }>({
    ID: undefined,
    number: 0,
  });
  const [warehouse, setWarehouse] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (cityID) {
      getNotAvailableItems(cityID.ID).then((items) => {
        setItems(items);
        setNewItem({
          ID: items.length > 0 ? items[0].ID : undefined,
          number: 0,
        });
      });
      getEntityInventory(cityID.inventory).then(setWarehouse);
    }
  }, [cityID]);

  const addItem = useCallback(async () => {
    if (newItem.ID && cityID) {
      await addCityWarehouseItem(newItem.ID, newItem.number, cityID.ID);

      await Promise.all([
        await getNotAvailableItems(cityID.ID),
        await getEntityInventory(cityID.ID),
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
  }, [newItem, cityID]);

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
    (ID: ID) =>
      async ({
        currentTarget: { value },
      }: React.ChangeEvent<HTMLInputElement>) => {
        if (cityID) {
          await updateInventoryItem(Number(value), ID);
          await getEntityInventory(cityID.ID).then(setWarehouse);
        }
      },
    [cityID]
  );

  return (
    <div>
      {warehouse.map(({ number, ID, nameKey }) => (
        <WarehouseRow
          key={ID}
          editable={debugMode}
          label={nameKey}
          number={number}
          direction="row"
        />
      ))}
      <div
        style={{
          display: "inline-flex",
          width: "100%",
          alignItems: "center",
          gap: "1em",
        }}
      >
        {debugMode && add && items.length !== 0 && (
          <>
            <Select onChange={selectNewItem}>
              {items.map(({ ID, nameKey }) => (
                <option key={ID} value={ID}>
                  {nameKey}
                </option>
              ))}
            </Select>
            <Input
              value={newItem.number}
              type="number"
              min={1}
              onChange={setNewItemNumber}
            />
            <Button
              style={{ width: "100%" }}
              disabled={!!newItem.ID || newItem.number === 0}
              onClick={addItem}
            >
              Add
            </Button>
          </>
        )}
        {debugMode && (
          <Button
            disabled={items.length === 0 && add}
            style={{ width: "100%" }}
            onClick={() => setAdd(!add)}
          >
            {add ? "close" : "+"}
          </Button>
        )}
      </div>
    </div>
  );
}
