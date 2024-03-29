import { isUndefined, uniq } from "lodash-es";

import { GroupBy } from "@Services/utils";

import { DBEvents } from "../dbTypes";
import { db, dbObservable } from "../gameState";
import { InventoryItem, Item, Translation } from "../tables/common";
import { ID, select } from "../utils/SimpleQueryBuider";

export async function moveBetweenInventories(
  inventoryAID: ID,
  inventoryBID: ID,
  amount: number,
  item: ID
) {
  await Promise.all([
    db.execute(
      "insert into Inventory (inventory, item, number) values(?, ?, 1) ON CONFLICT (inventory, item) DO UPDATE SET number = number + ? WHERE Inventory.inventory=? and item = ?;",
      [inventoryBID, item, amount, inventoryBID, item]
    ),
    db.execute(
      "UPDATE Inventory SET number = number - ? WHERE Inventory.inventory=? and item = ?;",
      [amount, inventoryAID, item]
    ),
  ]);

  dbObservable.next({
    type: DBEvents.inventoryUpdate,
  });
}

export type ItemsByCategory = Map<
  number,
  (Translation & Item & InventoryItem)[]
>;

const getAllItemsQuery = select<Translation & Item, "Item" | "Translations">({
  table: "Item",
  attributes: [
    ["Item", ["nameKey", "descriptionKey", "category", "ID"]],
    ["Translations", ["translation"]],
  ],
  join: [
    {
      A: "Translations",
      equation: {
        A: ["Item", "nameKey"],
        B: ["Translations", "key"],
      },
    },
  ],
});

export async function getAllItems() {
  const items = await db.select<(Translation & Item & InventoryItem)[]>(
    getAllItemsQuery
  );

  items.forEach((e) => (e.number = 0));

  return GroupBy(items, "category");
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

export const getEntityInventory = async (
  entityID?: ID
): Promise<ItemsByCategory> => {
  if (isUndefined(entityID)) {
    return new Map<number, (Translation & Item & InventoryItem)[]>();
  }

  return new Map<number, (Translation & Item & InventoryItem)[]>(
    await db.select(
      `select *
        from Inventory as INV
        inner join Item as I on I.ID = INV.item
        inner join translations on I.nameKey = translations.key
        where INV.inventory = $1
        group by category`,
      [entityID]
    )
  );
};

export const getEntityInventoryWeight = async (inventoryID?: ID) => {
  if (isUndefined(inventoryID)) {
    return { weight: 0 };
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
  if (isUndefined(cityID)) {
    return [];
  }

  const [items, warehouse] = await Promise.all([
    db.select<Item[]>(
      `select I.nameKey, I.descriptionKey, I.ID from Item as I`
    ),
    db.select<InventoryItem & Item[]>(
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

export async function getNumberOfInventoryItem(inventory?: ID, item?: ID) {
  if (isUndefined(inventory) || isUndefined(item)) {
    return { number: 0, item };
  }

  const result = await db.select<{ number: number; item: ID }[]>(
    "select * from inventory inner join Item on inventory.item = item.id where inventory.inventory = ? and item.id = ?;",
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

export async function getTwoInventoryCombo(inventoryA?: ID, inventoryB?: ID) {
  if (isUndefined(inventoryA) || isUndefined(inventoryB)) {
    return [new Map(), new Map()];
  }

  const cityID = (
    await db.select<{ ID: ID }[]>("select id from city where inventory = ?;", [
      inventoryA,
    ])
  ).map((e) => e.ID);

  const requiredIndustrialStuff = (
    await db.select<{ ID: ID }[]>(
      "select item as ID from industrialBuildings inner join IndustrialBuildingDailyRequirement on industrialBuildings.industrialBuilding = IndustrialBuildingDailyRequirement.industrialBuilding inner join City on City.ID = industrialBuildings.City where city.inventory = ?;",
      [inventoryA]
    )
  ).map((e) => e.ID);

  const requiredClassStuff = (
    await db.select<{ ID: ID }[]>(
      `select distinct item as ID from CityPopulationClass as C inner join PopulationClass as PC on C.populationClass = PC.id inner join ClassDailyRequirement as CDR 
  on CDR.Class = PC.id inner join City on C.city = City.id where City.inventory = ?;`,
      [inventoryA]
    )
  ).map((e) => e.ID);

  const itemIDs = (
    await db.select<{ ID: ID }[]>(
      "select item.id as ID, translations.translation from inventory inner join Item on inventory.item = item.id join translations on item.nameKey = translations.key where (inventory.inventory = $1 and item.id = (select item from inventory where inventory = $1)) or (inventory.inventory = $2 and item.id = (select item from inventory where inventory = $2));",
      [inventoryA, inventoryB]
    )
  ).map((e) => e.ID);

  const ids = uniq([
    ...cityID,
    ...requiredIndustrialStuff,
    ...requiredClassStuff,
    ...itemIDs,
  ]);

  return [
    GroupBy(
      await Promise.all<{ number: number; ID: ID; category: number }>(
        ids.map(async (itemID) => {
          const result = await db.select<
            { number: number; ID: ID; category: number }[]
          >(
            "select number, item.id, item.category, translations.translation from inventory join item on inventory.item = item.id join translations on item.nameKey = translations.key where inventory = ? and item =?",
            [inventoryA, itemID]
          );

          if (result.length === 0) {
            const info = await db.select<{ category: number }[]>(
              "select category, translations.translation from item join translations on item.nameKey = translations.key where id=?",
              [itemID]
            );
            return { ...info[0], number: 0, ID: itemID };
          }
          return result[0];
        })
      ),
      "category"
    ),
    GroupBy(
      await Promise.all<{ number: number; ID: ID; category: number }>(
        ids.map(async (itemID) => {
          const result = await db.select<
            { number: number; ID: ID; category: number }[]
          >(
            "select number, item.id, item.category, translations.translation from inventory join item on inventory.item = item.id join translations on item.nameKey = translations.key where inventory = ? and item =?",
            [inventoryB, itemID]
          );

          if (result.length === 0) {
            const info = await db.select<{ category: number }[]>(
              "select category, translations.translation from item join translations on item.nameKey = translations.key where id=?",
              [itemID]
            );
            return { ...info[0], number: 0, ID: itemID };
          }
          return result[0];
        })
      ),
      "category"
    ),
  ];
}

const selectAllItems = select<
  Item & Translation,
  "item" | "translations",
  Item
>({
  attributes: [["item", "*"]],
  table: "item",
  groupBy: "category",
  join: [
    {
      A: "translations",
      equation: { A: ["item", "nameKey"], B: ["translations", "id"] },
    },
  ],
});

export function getAllitems() {
  return db.select<Map<number, (Item & Translation)[]>>(selectAllItems);
}
