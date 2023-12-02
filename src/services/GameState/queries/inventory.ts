import { groupBy } from "lodash-es";

import { select } from "@Services/GameState/utils/simpleQueryBuilder";

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

  return groupBy(items, "category");
}

export const updateInventoryItem = async (number: number, ID: ID) => {
  const ret = await db.execute(
    `update Inventory set number = $1 where ID = $2`,
    [number, ID]
  );

  dbObservable.next({ type: DBEvents.inventoryUpdate });

  return ret;
};

export const addCityWarehouseItem = async (
  item: number,
  number: number,
  cityID: ID
) => {
  const ret = await db.execute(
    `insert into Inventory (city, item, number) values ($1, $2, $3)`,
    [cityID, item, number]
  );

  dbObservable.next({ type: DBEvents.inventoryUpdate });

  return ret;
};

export const getEntityInventory = async (entityID?: ID) => {
  if (!entityID) {
    return [];
  }

  return db.select<InventoryItem[]>(
    `select I.nameKey, I.descriptionKey, INV.number, INV.weight, I.ID as ID
        from Inventory as INV
        inner join Item as I on I.ID = INV.item
        where INV.inventory = $1`,
    [entityID]
  );
};

export const getEntityInventoryWeight = async (inventoryID?: ID) => {
  if (typeof inventoryID === "undefined") {
    return {};
  }

  return (
    await db.select<{ weight?: number }[]>(
      `select sum(I.weight * INV.number) as weight
        from Inventory as INV
        inner join Item as I on I.ID = INV.item
        where INV.inventory = $1;`,
      [inventoryID]
    )
  )[0];
};

export const getNotAvailableItems = async (cityID?: ID) => {
  if (typeof cityID === "undefined") {
    return [];
  }

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

export async function getNumberOfInventoryItem(inventory: ID, item: ID) {
  const result = await db.select<{ number: number; item: ID }[]>(
    "select number, item from inventory inner join Item on inventory.item = item.id where inventory.inventory = ? and item.id = ?;",
    [inventory, item]
  );

  if (result?.length === 0) {
    await db.execute(
      "insert into inventory (inventory, item, number) values(?,?,?)",
      [inventory, item, 0]
    );

    return { number: 0, item };
  }

  return result[0];
}
