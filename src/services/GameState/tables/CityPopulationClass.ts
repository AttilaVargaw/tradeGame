import { TableData } from "./common";

export type CityPopulationClassData = {
  num: number;
  populationClass: number;
  city: number;
  ID: number;
};

export type CityPopulationClassTableName = "CityPopulationClass";

export default {
  createData: [
    {
      name: "num",
      type: "INTEGER",
    },
    {
      name: "populationClass",
      type: "INTEGER",
    },
    { name: "city", type: "INTEGER", references: "City" },
  ],
  name: "CityPopulationClass",
  initData: [
    { city: 1, num: 1000, populationClass: 1 },
    { city: 1, num: 15000, populationClass: 2 },
  ],
} as TableData<CityPopulationClassData>;
