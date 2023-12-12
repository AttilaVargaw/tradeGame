import { ItemsByCategory } from "@Services/GameState/queries/inventory";

import {
  ID,
  IndustrialBuilding,
  InventoryItem,
  PopulationData,
} from "../../dbTypes";
import { ResourceChange, TableData } from "../common";

export type CityTableName = "City";

export type IndustryData = {
  industrialBuildings: IndustrialBuilding[];
  aggregatedInputOutput: ResourceChange[];
};

export type CityEntity = {
  classes: PopulationData[];
  ID: ID;
  posX: number;
  posY: number;
  type: string;
  name: string;
  fullPopulation: number;
  industry: IndustryData;
  warehouse: ItemsByCategory;
  inventory: number;
};

export type CityData = {
  ID: ID;
  posX: number;
  posY: number;
  type: number;
  name: string;
  inventory: number;
  industrialBuildings?: number;
};

export default {
  name: "City",
  createData: [
    { name: "posX", type: "INTEGER" },
    { name: "posY", type: "INTEGER" },
    { name: "type", type: "INTEGER" /*references: "CityTypes"*/ },
    { name: "name", type: "TEXT" },
    { name: "inventory", type: "INTEGER" },
    {
      name: "industrialBuildings",
      // references: "industrialBuildings",
      type: "INTEGER",
    },
  ],
  initData: [
    {
      posY: 3300.0,
      posX: 1000.0,
      type: 1,
      name: "East Harbour City",
      inventory: 0,
    },
    {
      posY: 3000.0,
      posX: 1200.0,
      type: 3,
      name: "Black Hill Military Base",
      inventory: 1,
    },
    {
      posY: 2400.0,
      posX: 1200.0,
      type: 1,
      name: "Yellow Mountain Mining Colony",
      inventory: 2,
    },
    {
      posY: 2600.0,
      posX: 1400.0,
      type: 3,
      name: "Old desolated robotic laboratory",
      inventory: 3,
    },
    {
      posY: 1400.0,
      posX: 850.0,
      type: 4,
      name: "Federal Atomics Laboratory",
      inventory: 4,
    },
    {
      posY: 1200.0,
      posX: 760.0,
      type: 1,
      name: "Mutant city of Todesheim",
      inventory: 5,
    },
    {
      posY: 1600.0,
      posX: 900.0,
      type: 3,
      name: "Old desolated pirate bunker",
      inventory: 6,
    },
    {
      posY: 1325.0,
      posX: 240.0,
      type: 1,
      name: "Mutant village",
      inventory: 10,
    },

    {
      posY: 2640.0,
      posX: 1080.0,
      type: 3,
      name: "Wilhelm Company Head Quarters",
      inventory: 7,
    },
    {
      posY: 2840.0,
      posX: 960.0,
      type: 3,
      name: "Lavasee Military Academy Campus",
      inventory: 8,
    },
    {
      posY: 2440.0,
      posX: 920.0,
      type: 5,
      name: "Federal Agronomic laboratory",
      inventory: 9,
    },
  ],
} as TableData<CityData>;
