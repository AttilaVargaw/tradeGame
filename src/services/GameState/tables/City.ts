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
    { posX: 3300.0, posY: 1000.0, type: 1, name: "East Harbour City" },
    {
      posX: 3000.0,
      posY: 1200.0,
      type: 3,
      name: "Black Hill Military Base",
    },
    {
      posX: 2400.0,
      posY: 1200.0,
      type: 1,
      name: "Yellow Mountain Mining Colony",
    },
    {
      posX: 2600.0,
      posY: 1400.0,
      type: 3,
      name: "Old desolated robotic laboratory",
    },
    {
      posX: 1400.0,
      posY: 850.0,
      type: 4,
      name: "Federal Atomics Laboratory",
    },
    {
      posX: 1200.0,
      posY: 760.0,
      type: 1,
      name: "Mutant city of Todesheim",
    },
    {
      posX: 1600.0,
      posY: 900.0,
      type: 3,
      name: "Old desolated pirate bunker",
    },
    { posX: 1325.0, posY: 240.0, type: 1, name: "Mutant village" },

    {
      posX: 2640.0,
      posY: 1080.0,
      type: 3,
      name: "Wilhelm Company Head Quarters",
    },
    {
      posX: 2840.0,
      posY: 960.0,
      type: 3,
      name: "Lavasee Military Academy Campus",
    },
    {
      posX: 2440.0,
      posY: 920.0,
      type: 5,
      name: "Federal Agronomic laboratory",
    },
  ],
} as TableData<CityData>;
