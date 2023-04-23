import { TableData } from "./common";

export type ConvoyData = {
  name: string;
  type: string;
  ID: number;
  posY: number;
  posX: number;
  route: number;
};

export type ConvoyTableName = "Convoy";

export default {
  name: "Convoy",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "posY", type: "REAL" },
    { name: "posX", type: "REAL" },
    { name: "type", type: "INTEGER" },
    { name: "route", type: "INTEGER" },
  ],
  initData: [{ name: "Test Convoy", type: "1", posX: 1670, posY: 520 }],
} as TableData<ConvoyData>;
