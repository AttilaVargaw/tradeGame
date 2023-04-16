export type CityPopulationClass = {
  num: number;
  ID: string;
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
  ID: string;
  nameKey: string;
  descriptionKey: string;
};

export type PopulationData = {
  ID: string;
  num: number;
  name: string;
  dailyRequirement: DailyRequirement[];
};

export type ResourceChange = {
  ID: string;
  item: string;
  num: number;
  nameKey: string;
  descriptionKey: string;
};

export type IndustrialBuilding = {
  buildingNum: number;
  nameKey: string;
  ID: string;
  inputOutputData: ResourceChange[];
};

export type IndustryData = {
  industrialBuildings: IndustrialBuilding[];
  aggregatedInputOutput: ResourceChange[];
};

export type WarehouseItem = {
  ID: string;
  number: number;
  city: string;
  nameKey: string;
  dailyRequirement: number;
  itemID: string;
};

export type City = {
  classes: PopulationData[];
  ID: string;
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
  ID: string;
  name: string;
};

export type TradeRoute = {
  cityID: string[];
  start: number[];
  end: number[];
  inBetween: number[][];
  name: string;
};

export type TradeRouteProps = {
  cities: string[];
  name: string;
  ID: string;
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
  ID: string;
};

export type Convoy = {
  name: string;
  type: string;
  ID: string;
};

export type Vehicle = {
  name: string;
  type: string;
  ID: string;
};

export type VehicleType = {
  name: string;
  desc: string;
  ID: string;
  price: number;
  type: string;
};

export type ConvoyAttr = "name" | "ID";

export type VehicleTypeAttr = "name" | "desc" | "price" | "ID" | "type";

export type VehicleTypeInsertAttributes = "name" | "desc" | "price" | "type";

export type CityAttr = "ID" | "posX" | "posY" | "type" | "name";

export type VehicleAttr = "name" | "type" | "posX" | "posY" | "convoy" | "ID";

export type TradeRouteInsertAttributes = "cityA" | "cityB" | "name";

export type TradeRouteAttributes = TradeRouteInsertAttributes | "ID";

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
  | "CityWarehouse"
  | "Item"
  | "CityPopulationClass"
  | "IndustrialBuildings";

export type CityTypes = "name";
