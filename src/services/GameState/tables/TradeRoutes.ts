import { PopulationClass } from "../dbTypes";
import { TableData } from "./common";

export type TradeRoute = {
  name: "Aristocracy" | "Wealthy" | "Mutants" | "Workers";
  ID: number;
};

export type TradeRoutesTableName = "TradeRoutes";

export default {
  name: "TradeRoutes",
  createData: [
    { name: "CityA", type: "INTEGER" /*references: "City"*/ },
    { name: "CityB", type: "INTEGER" /*references: "City"*/ },
    { name: "name", type: "TEXT" },
  ],
} as TableData<TradeRoute>;
