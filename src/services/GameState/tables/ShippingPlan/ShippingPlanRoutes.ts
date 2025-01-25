import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { TableData } from "../common";

export type ShippingPlanRoute = {
  ID: ID;
  plan: ID;
  route: ID;
  routeOrder: number;
};

export default {
  name: "ShippingPlanRoutes",
  createData: [
    { name: "plan", type: "INTEGER" },
    { name: "route", type: "INTEGER" },
    { name: "routeOrder", type: "INTEGER" },
  ],
  initData: [{ plan: 1, route: 1, routeOrder: 0 }],
} as TableData<ShippingPlanRoute>;
