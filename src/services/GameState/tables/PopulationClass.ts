import { ID } from "../dbTypes";
import { TableData } from "./common";

export type PopulationClass = {
  name: "Aristocracy" | "Wealthy" | "Mutants" | "Workers";
  ID: ID;
};

export type PopulationClassTableName = "PopulationClass";

export default {
  createData: [
    {
      name: "name",
      type: "TEXT",
    },
  ],
  name: "PopulationClass",
  initData: [
    {
      name: "Aristocracy",
    },
    { name: "Wealthy" },
    { name: "Workers" },
    { name: "Mutants" },
  ],
} as TableData<PopulationClass>;
