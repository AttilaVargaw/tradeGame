import { TableData } from "./common";

export type ConvoyData = {
  name: string;
  type: string;
  ID: number;
  posY: number;
  posX: number;
  route: number;
  goalY?: number;
  goalX?: number;
  goalVectorX?: number;
  goalVectorY?: number;
  dockedTo?: number;
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
    { name: "goalY", type: "REAL" },
    { name: "goalX", type: "REAL" },
    { name: "dockedTo", type: "INTEGER" },
  ],
  initData: [{ name: "Test Convoy", type: "1", posY: 3340, posX: 1040 }],
} as TableData<ConvoyData>;
