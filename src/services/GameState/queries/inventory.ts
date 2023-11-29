import { groupBy } from "lodash-es";

import { select, update } from "@Services/GameState/utils/simpleQueryBuilder";

import { DBEvents, ID, InventoryItem, Item } from "../dbTypes";
import { db, dbObservable } from "../gameState";
import { Tables } from "../tables/common";

export async function moveBetweenInventories(
  inventoryAID: ID,
  inventoryBID: ID,
  amount: number
) {
  await Promise.all([
    db.execute(
      "UPDATE Inventory SET number = number + ? WHERE Inventory.inventory=?;",
      [amount, inventoryBID]
    ),
    db.execute(
      "UPDATE Inventory SET number = number - ? WHERE Inventory.inventory=?;",
      [amount, inventoryAID]
    ),
  ]);

  dbObservable.next({
    type: DBEvents.inventoryUpdate,
  });
}

export async function getAllItems(inventoryID: ID) {
  const items = await db.select<InventoryItem[]>(
    select({
      table: Tables.Inventory,
      attributes: [
        [Tables.Item, ["nameKey", "descriptionKey", "category", "ID"]],
        [Tables.Translations, "translation"],
        [Tables.Inventory, ["inventory", "number"]],
      ],
      join: [
        {
          A: Tables.Translations,
          equation: {
            A: [Tables.Item, "nameKey"],
            B: [Tables.Translations, "key"],
          },
        },
        {
          A: Tables.Item,
          equation: {
            A: [Tables.Inventory, "item"],
            B: [Tables.Item, "ID"],
          },
        },
      ],
      where: [
        {
          A: [Tables.Inventory, "inventory"],
          value: inventoryID,
          operator: "=",
        },
      ],
    })
  );

  console.log(items, inventoryID);

  return groupBy(items, "category");
}

export const updateInventoryItem = (number: number, ID: ID) => {
  return db.execute(`update Inventory set number = $1 where ID = $2`, [
    number,
    ID,
  ]);
};

export const addCityWarehouseItem = (
  item: number,
  number: number,
  cityID: ID
) => {
  return db.execute(
    `insert into Inventory (city, item, number) values ($1, $2, $3)`,
    [cityID, item, number]
  );
};

export const getEntityInventory = (entityID: ID) => {
  return db.select<InventoryItem[]>(
    `select I.nameKey, I.descriptionKey, INV.number, I.ID as ID
        from Inventory as INV
        inner join Item as I on I.ID = INV.item
        where INV.inventory = $1`,
    [entityID]
  );
};

export const getNotAvailableItems = async (cityID: ID) => {
  const [items, warehouse] = await Promise.all([
    db.select<Item[]>(`select I.nameKey, I.descriptionKey, I.ID
          from Item as I`),
    db.select<InventoryItem[]>(
      `select I.nameKey, I.descriptionKey, INV.number, I.ID
          from Inventory as INV
          inner join Item as I on I.ID = INV.item
          where INV.ID = $1`,
      [cityID]
    ),
  ]);

  return items
    .filter((value) => warehouse.every(({ ID }) => value.ID !== ID))
    .map(({ ID, descriptionKey, nameKey }) => ({
      ID,
      descriptionKey,
      nameKey,
    }));
};
