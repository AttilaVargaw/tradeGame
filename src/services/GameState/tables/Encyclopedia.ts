import { TableData } from "./common";

export type Encyclopedia = {
  name: "Aristocracy" | "Wealthy" | "Mutants" | "Workers";
  ID: number;
};

export type EncyclopediaTableName = "PopulationClass";

export default {
  createData: [
    {
      name: "name",
      type: "TEXT",
    },
    {
      name: "body",
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
} as TableData<Encyclopedia>;
