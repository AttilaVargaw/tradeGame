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
    { posX: 1650.0, posY: 500.0, type: 1, name: "East Harbour City" },
    {
      posX: 1500.0,
      posY: 600.0,
      type: 3,
      name: "Black Hill Military Base",
    },
    {
      posX: 1200.0,
      posY: 600.0,
      type: 1,
      name: "Yellow Mountain Mining Colony",
    },
    {
      posX: 1300.0,
      posY: 700.0,
      type: 3,
      name: "Old desolated robotic laboratory",
    },
    {
      posX: 1200.0,
      posY: 425.0,
      type: 4,
      name: "Federal Atomics Laboratory",
    },
    {
      posX: 600.0,
      posY: 380.0,
      type: 1,
      name: "Mutant city of Todesheim",
    },
    {
      posX: 800.0,
      posY: 450.0,
      type: 3,
      name: "Old desolated pirate bunker",
    },
    { posX: 1325.0, posY: 240.0, type: 1, name: "Mutant village" },

    {
      posX: 1320.0,
      posY: 540.0,
      type: 3,
      name: "Wilhelm Company Head Quarters",
    },
    {
      posX: 1420.0,
      posY: 480.0,
      type: 3,
      name: "Lavasee Military Academy Campus",
    },
    {
      posX: 1220.0,
      posY: 460.0,
      type: 5,
      name: "Federal Agronomic laboratory",
    },
  ],
} as TableData<CityData>;
