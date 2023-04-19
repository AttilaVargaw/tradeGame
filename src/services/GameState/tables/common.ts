import { CityTableName } from "./City";
import { CityTypesTableName } from "./CityTypes";
import { VehicleTypesName } from "./vehicleTypes";

export type dbTypes = "REAL" | "INTEGER" | "TEXT";

export type ResourceChange = {
  ID: number;
  item: string;
  num: number;
  nameKey: string;
  descriptionKey: string;
};

export enum Tables {
  VehicleData = "VehicleData",
  Convoy = "Convoy",
  Vehicle = "Vehicle",
  VehicleTypes = "VehicleTypes",
  TradeRoutes = "TradeRoutes",
  CityTypes = "CityTypes",
  Translations = "Translations",
  ClassDailyRequirement = "ClassDailyRequirement",
  City = "City",
  IndustrialBuildingDailyRequirement = "IndustrialBuildingDailyRequirement",
  IndustrialBuilding = "IndustrialBuilding",
  PopulationClass = "PopulationClass",
  CityWarehouse = "CityWarehouse",
  Item = "Item",
  CityPopulationClass = "CityPopulationClass",
  IndustrialBuildings = "IndustrialBuildings",
}

type Attr = {
  name: string;
  type: dbTypes;
  references?: string;
  referencesOn?: string;
  notNullable?: boolean | null;
};

export type ConvoyAttr = "name" | "ID";

export type CityAttr = "ID" | "posX" | "posY" | "type" | "name";

export type VehicleAttr = "name" | "type" | "posX" | "posY" | "convoy" | "ID";

export type TradeRouteAttr = "cityA" | "cityB" | "name" | "ID";

export type TableData<TABLE> = {
  initData?: TABLE[];
  createData: Attr[];
  name: string;
};
