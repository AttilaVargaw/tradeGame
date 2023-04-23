import { TableData } from "./common";

export type IndustrialBuildingDailyRequirementName =
  "IndustrialBuildingDailyRequirement";

export type IndustrialBuildingDailyRequirementData = {
  industrialBuilding: number;
  item: number;
  num: number;
  ID: number;
};

export default {
  name: "IndustrialBuildingDailyRequirement",
  createData: [
    { name: "industrialBuilding", type: "INTEGER" },
    { name: "item", type: "INTEGER" },
    { name: "num", type: "REAL" },
  ],
  initData: [
    {
      industrialBuilding: 1,
      item: 3,
      num: 1000,
    },
    {
      industrialBuilding: 2,
      item: 17,
      num: -1000,
    },
    {
      industrialBuilding: 3,
      item: 1,
      num: 1000,
    },
  ],
} as TableData<IndustrialBuildingDailyRequirementData>;
