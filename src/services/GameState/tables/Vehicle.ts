import { ID } from "../dbTypes";
import { TableData } from "./common";

export type VehicleData = {
  name: string;
  type: number;
  ID: ID;
  convoy: number;
  posY: number;
  posX: number;
  goalY?: number;
  goalX?: number;
  speed: number;
  entity: number;
};

export default {
  name: "Vehicle",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "entity", type: "INTEGER" },
    {
      name: "type",
      type: "TEXT",
      //references: "VehicleTypes",
    },
    { name: "posY", type: "REAL" },
    { name: "posX", type: "REAL" },
    { name: "goalY", type: "REAL" },
    { name: "goalX", type: "REAL" },
    { name: "speed", type: "REAL" },
    {
      name: "convoy",
      type: "INTEGER",
      //references: "Convoy",
    },
  ],
  initData: [
    { convoy: 1, name: "Test Vehicle", type: 8, posX: 3300, posY: 1020, entity: 10 },
    { name: "Test Vehicle 2", type: 1, posX: 3310, posY: 1040, entity: 11 },
  ],
} as TableData<VehicleData>;
