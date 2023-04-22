import { TableData } from "./common";

export type ConvoyData = {
  name: string;
  type: string;
  ID: number;
};

export type ConvoyTableName = "Convoy";

export default {
  name: "Convoy",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "posY", type: "REAL" },
    { name: "posX", type: "REAL" },
    { name: "type", type: "INTEGER" },
  ],
} as TableData<ConvoyData>;
