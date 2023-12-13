import { ID, update } from "../utils/SimpleQueryBuider";

export type dbTypes = "REAL" | "INTEGER" | "TEXT";

export type ResourceChange = {
  ID: ID;
  item: string;
  num: number;
  nameKey: string;
  descriptionKey: string;
};

export type Tables =
  | "VehicleData"
  | "Convoy"
  | "Vehicle"
  | "VehicleTypes"
  | "TradeRoutes"
  | "CityTypes"
  | "Translations"
  | "ClassDailyRequirement"
  | "City"
  | "IndustrialBuildingDailyRequirement"
  | "IndustrialBuilding"
  | "PopulationClass"
  | "Inventory"
  | "Item"
  | "CityPopulationClass"
  | "IndustrialBuildings"
  | "Encyclopedia"
  | "";

type Attr = {
  name: string;
  type: dbTypes;
  references?: string;
  referencesOn?: string;
  notNullable?: boolean | null;
};

export type TableData<TABLE> = {
  initData?: TABLE[];
  createData: Attr[];
  name: string;
};

export type DailyRequirement = {
  num: number;
  itemID: ID;
  nameKey: string;
  ID: ID;
  dailyRequirementID: ID;
  dailyRequirement: number;
  descriptionKey: number;
  translation: string;
};

export type Item = {
  ID: ID;
  startPrice: number;
  endPricec: number;
  nameKey: string;
  descriptionKey: string;
  category: number;
  weight: number;
};

export type PopulationData = {
  ID: ID;
  num: number;
  name: string;
  dailyRequirement: DailyRequirement[];
};

export type IndustrialBuilding = {
  buildingNum: number;
  nameKey: string;
  ID: ID;
  inputOutputData: ResourceChange[];
};

export type InventoryItem = {
  ID: ID;
  number: number;
  item: ID;
};

export type Translation = {
  key: string;
  lang: string;
  translation: string;
};

export type PopulationClass = {
  ID: ID;
  name: string;
};

export type CityPositionProperty = {
  name: string;
  type: string;
  ID: ID;
};
