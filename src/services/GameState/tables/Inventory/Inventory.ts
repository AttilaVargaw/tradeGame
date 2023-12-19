import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { TableData } from "../common";

export type InventoryData = {
  inventory: ID;
  item: ID;
  number: number;
  ID: ID;
};

export default {
  name: "Inventory",
  createData: [
    { name: "item", type: "INTEGER" },
    { name: "inventory", type: "INTEGER" },
    { name: "number", type: "INTEGER" },
  ],
  initData: [
    { inventory: 0, item: 1, number: 1005 },
    { inventory: 3, item: 3, number: 5 },
    { inventory: 10, item: 3, number: 5 },
  ],
} as TableData<InventoryData>;
