import { TableData } from "./common";

export type VehicleData = {
  name: string;
  type: string;
  ID: number;
  convoy: number;
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
} as TableData<VehicleData>;
