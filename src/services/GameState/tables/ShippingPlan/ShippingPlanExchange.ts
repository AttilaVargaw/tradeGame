import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { INTEGER, TableData } from "../common";

export type ShippingPlanExchange = {
  item: ID;
  number: INTEGER;
  ID: ID;
  plan: ID;
};

export default {
  name: "ShippingPlanExchanges",
  createData: [
    { name: "item", type: "INTEGER" },
    { name: "number", type: "INTEGER" },
    { name: "plan", type: "INTEGER" },
    "UNIQUE(item, plan)",
  ],

  initData: [],
} as TableData<ShippingPlanExchange>;
