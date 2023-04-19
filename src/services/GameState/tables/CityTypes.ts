import { TableData } from "./common";

export type CityTypes = {
  name:
    | "Metropolis"
    | "MiningColony"
    | "MilitaryBase"
    | "RandomEncounter"
    | "ResearchStation";
};

export type CityTypesTableName = "CityTypes";

export default {
  createData: [
    {
      name: "name",
      type: "TEXT",
    },
  ],
  name: "CityTypes",
  initData: [
    {
      name: "Metropolis",
    },
    { name: "MilitaryBase" },
    { name: "MiningColony" },
    { name: "RandomEncounter" },
    { name: "ResearchStation" },
  ],
} as TableData<CityTypes>;
