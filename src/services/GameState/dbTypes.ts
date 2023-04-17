export type CityPopulationClass = {
  num: number;
  ID: number;
  populationClass: string;
  city: string;
};

export type DailyRequirement = {
  num: number;
  itemID: number;
  nameKey: string;
  ID: number;
  dailyRequirementID: number;
  dailyRequirement: number;
  descriptionKey: number;
};

export type Item = {
  ID: number;
  nameKey: string;
  descriptionKey: string;
};

export type PopulationData = {
  ID: number;
  num: number;
  name: string;
  dailyRequirement: DailyRequirement[];
};

export type ResourceChange = {
  ID: number;
  item: string;
  num: number;
  nameKey: string;
  descriptionKey: string;
};

export type IndustrialBuilding = {
  buildingNum: number;
  nameKey: string;
  ID: number;
  inputOutputData: ResourceChange[];
};

export type IndustryData = {
  industrialBuildings: IndustrialBuilding[];
  aggregatedInputOutput: ResourceChange[];
};

export type WarehouseItem = {
  ID: number;
  number: number;
  city: string;
  nameKey: string;
  dailyRequirement: number;
  itemID: number;
};

export type City = {
  classes: PopulationData[];
  ID: number;
  posX: number;
  posY: number;
  type: string;
  industrialBuildings: [];
  name: string;
  fullPopulation: number;
  industry: IndustryData;
  warehouse: WarehouseItem[];
};

export type PopulationClass = {
  ID: number;
  name: string;
};

export type TradeRoute = {
  cityID: number[];
  start: number[];
  end: number[];
  inBetween: number[][];
  name: string;
};

export type TradeRouteProps = {
  cities: number[];
  name: string;
  ID: number;
};

export enum DBEvents {
  NOP,
  initialized,
  tradeRouteUpdate,
  cityWarehouseUpdate,
  cityPopulationUpdate,
}

export type DBEvent = {
  type: DBEvents;
  data?: any;
};

export type CityPositionProperty = {
  name: string;
  type: string;
  ID: number;
};

export type Convoy = {
  name: string;
  type: string;
  ID: number;
};

export type Vehicle = {
  name: string;
  type: string;
  ID: number;
};

export type VehicleType = {
  name: string;
  desc: string;
  ID: number;
  price: number;
  type: string;
};

export type ConvoyAttr = "name" | "ID";

export type VehicleTypeAttr = "name" | "desc" | "price" | "ID" | "type";

export type CityAttr = "ID" | "posX" | "posY" | "type" | "name";

export type VehicleAttr = "name" | "type" | "posX" | "posY" | "convoy" | "ID";

export type TradeRouteAttr = "cityA" | "cityB" | "name" | "ID";

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

export type VehicleInsertData = {
  name: string;
  type: string;
  posX: number;
  posY: number;
};

export type TradeRouteInsertData = {
  cityA: number;
  cityB: number;
  name: string;
};

export type VehicleTypeInsertData = {
  name: string;
  desc: string;
  price: number;
  type: string;
};

export type CityTypes = "name";
