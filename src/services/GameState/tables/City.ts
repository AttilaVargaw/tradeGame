import { IndustrialBuilding, PopulationData, WarehouseItem } from "../dbTypes";
import { ResourceChange, TableData } from "./common";

export type CityTableName = "City";

export type IndustryData = {
  industrialBuildings: IndustrialBuilding[];
  aggregatedInputOutput: ResourceChange[];
};

export type CityEntity = {
  classes: PopulationData[];
  ID: number;
  posX: number;
  posY: number;
  type: string;
  name: string;
  fullPopulation: number;
  industry: IndustryData;
  warehouse: WarehouseItem[];
};

export type CityData = {
  ID: number;
  posX: number;
  posY: number;
  type: number;
  name: string;
  industrialBuildings?: number;
};

export default {
  name: "City",
  createData: [
    { name: "posX", type: "INTEGER" },
    { name: "posY", type: "INTEGER" },
    { name: "type", type: "INTEGER" /*references: "CityTypes"*/ },
    { name: "name", type: "TEXT" },
    {
      name: "industrialBuildings",
      // references: "industrialBuildings",
      type: "INTEGER",
    },
  ],
  initData: [
    { posY: 3300.0, posX: 1000.0, type: 1, name: "East Harbour City" },
    {
      posY: 3000.0,
      posX: 1200.0,
      type: 3,
      name: "Black Hill Military Base",
    },
    {
      posY: 2400.0,
      posX: 1200.0,
      type: 1,
      name: "Yellow Mountain Mining Colony",
    },
    {
      posY: 2600.0,
      posX: 1400.0,
      type: 3,
      name: "Old desolated robotic laboratory",
    },
    {
      posY: 1400.0,
      posX: 850.0,
      type: 4,
      name: "Federal Atomics Laboratory",
    },
    {
      posY: 1200.0,
      posX: 760.0,
      type: 1,
      name: "Mutant city of Todesheim",
    },
    {
      posY: 1600.0,
      posX: 900.0,
      type: 3,
      name: "Old desolated pirate bunker",
    },
    { posY: 1325.0, posX: 240.0, type: 1, name: "Mutant village" },

    {
      posY: 2640.0,
      posX: 1080.0,
      type: 3,
      name: "Wilhelm Company Head Quarters",
    },
    {
      posY: 2840.0,
      posX: 960.0,
      type: 3,
      name: "Lavasee Military Academy Campus",
    },
    {
      posY: 2440.0,
      posX: 920.0,
      type: 5,
      name: "Federal Agronomic laboratory",
    },
  ],
} as TableData<CityData>;
