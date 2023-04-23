import { TableData } from "./common";

export type VehicleData = {
  name: string;
  type: number;
  ID: number;
  convoy: number;
  posY: number;
  posX: number;
};

export default {
  name: "Vehicle",
  createData: [
    { name: "name", type: "TEXT" },
    {
      name: "type",
      type: "TEXT",
      //references: "VehicleTypes",
    },
    { name: "posY", type: "REAL" },
    { name: "posX", type: "REAL" },
    {
      name: "convoy",
      type: "INTEGER",
      //references: "Convoy",
    },
  ],
  initData: [
    { convoy: 1, name: "Test Vehicle", type: 3, posX: 1650, posY: 510 },
  ],
} as TableData<VehicleData>;
