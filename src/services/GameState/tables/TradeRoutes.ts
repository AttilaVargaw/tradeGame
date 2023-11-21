import { ID } from "../dbTypes";
import { TableData } from "./common";

export type TradeRoute = {
  CityA: number;
  CityB: number;
  name: string;
  ID: ID;
};

export type TradeRoutesTableName = "TradeRoutes";

export default {
  name: "TradeRoutes",
  createData: [
    { name: "CityA", type: "INTEGER" /*references: "City"*/ },
    { name: "CityB", type: "INTEGER" /*references: "City"*/ },
    { name: "name", type: "TEXT" },
  ],
  initData: [{ CityA: 1, CityB: 2, name: "First TradeRoute" }],
} as TableData<TradeRoute>;
