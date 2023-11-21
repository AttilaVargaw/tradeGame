import { ID } from "../dbTypes";
import { TableData } from "./common";

export type CityPopulationClassData = {
  num: number;
  populationClass: number;
  city: number;
  ID: ID;
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
    { name: "city", type: "INTEGER" /*references: "City"*/ },
  ],
  name: "CityPopulationClass",
  initData: [
    { city: 1, num: 1000, populationClass: 1 },
    { city: 1, num: 15000, populationClass: 2 },
    { city: 1, num: 4000, populationClass: 3 },
    { city: 1, num: 20000, populationClass: 4 },
  ],
} as TableData<CityPopulationClassData>;
