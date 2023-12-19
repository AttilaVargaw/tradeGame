import { ID, update } from "../utils/SimpleQueryBuider";

export type dbTypes = "REAL" | "INTEGER" | "TEXT";

export type ResourceChange = {
  ID: ID;
  item: string;
  num: number;
  nameKey: string;
  descriptionKey: string;
};

export type INTEGER = number;
export type REAL = number;
export type TEXT = string;
export type BOOLEAN = 0 | 1;

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
  | "Encyclopedia";

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
  nameKey: TEXT;
  ID: ID;
  dailyRequirementID: ID;
  dailyRequirement: REAL;
  descriptionKey: REAL;
  translation: TEXT;
};

export type Item = {
  ID: ID;
  startPrice: REAL;
  endPricec: REAL;
  nameKey: TEXT;
  descriptionKey: TEXT;
  category: ID;
  weight: REAL;
};

export type PopulationData = {
  ID: ID;
  num: INTEGER;
  name: TEXT;
  dailyRequirement: DailyRequirement[];
};

export type IndustrialBuilding = {
  buildingNum: INTEGER;
  nameKey: TEXT;
  ID: ID;
  inputOutputData: ResourceChange[];
};

export type InventoryItem = {
  ID: ID;
  number: INTEGER;
  item: ID;
};

export type Translation = {
  key: TEXT;
  lang: TEXT;
  translation: TEXT;
};

export type PopulationClass = {
  ID: ID;
  name: TEXT;
};

export type CityPositionProperty = {
  name: TEXT;
  type: TEXT;
  ID: ID;
};
