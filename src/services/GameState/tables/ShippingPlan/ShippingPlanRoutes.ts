import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { TableData } from "../common";

export type ShippingPlanRoute = {
  ID: ID;
  plan: ID;
  route: ID;
  city: ID;
};

export default {
  name: "ShippingPlanRoutes",
  createData: [
    { name: "plan", type: "INTEGER" },
    { name: "route", type: "INTEGER" },
    { name: "inventory", type: "INTEGER" },
  ],
  initData: [{ plan: 0, route: 0 }],
} as TableData<ShippingPlanRoute>;
