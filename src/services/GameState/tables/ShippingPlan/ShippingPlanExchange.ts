import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { INTEGER, TableData } from "../common";

export type ShippingPlanExchange = {
  item: ID;
  number: INTEGER;
  ID: ID;
  plan: ID;
  start: boolean;
};

export default {
  name: "ShippingPlanExchanges",
  createData: [
    { name: "item", type: "INTEGER" },
    { name: "number", type: "INTEGER" },
    { name: "plan", type: "INTEGER" },
    { name: "start", type: "INTEGER" },
    "UNIQUE(item, plan, start)",
  ],

  initData: [
    {
      item: 1,
      number: 10,
      plan: 1,
      start: true,
    },
    {
      item: 3,
      number: 15,
      plan: 1,
      start: true,
    },
    {
      item: 1,
      number: -10,
      plan: 1,
      start: false,
    },
    {
      item: 3,
      number: -15,
      plan: 1,
      start: false,
    },
  ],
} as TableData<ShippingPlanExchange>;
