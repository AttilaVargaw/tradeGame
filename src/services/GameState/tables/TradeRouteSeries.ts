import { TableData } from "./common";

export type TradeRoute = {
  current: number;
  next: number;
};

export type TradeRoutesTableName = "TradeRouteSeries";

export default {
  name: "TradeRouteSeries",
  createData: [
    { name: "current", type: "INTEGER" /*references: "City"*/ },
    { name: "next", type: "INTEGER" /*references: "City"*/ },
  ],
} as TableData<TradeRoute>;
