import { TableData } from "./common";

export type PopulationClass = {
  name: "Aristocracy" | "Wealthy" | "Mutants" | "Workers";
  ID: number;
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
    { name: "Mutants" },
    { name: "Wealthy" },
    { name: "Workers" },
  ],
} as TableData<PopulationClass>;
