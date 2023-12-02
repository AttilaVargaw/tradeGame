import { ResourceChange } from "./tables/common";

export type ID = number;

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
  nameKey: string;
  descriptionKey: string;
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
  city: string;
  nameKey: string;
  // dailyRequirement: number;
  category: number;
  item: ID;
  translation: string;
};

export type PopulationClass = {
  ID: ID;
  name: string;
};

export type TradeRoute = {
  cityID: ID[];
  start: number[];
  end: number[];
  inBetween: number[][];
  name: string;
};

export type TradeRouteProps = {
  cities: number[];
  name: string;
  ID: ID;
};

export enum DBEvents {
  NOP,
  initialized,
  tradeRouteUpdate,
  tradeRouteAdded,
  cityWarehouseUpdate,
  cityPopulationUpdate,
  newVehicleBought,
  newConvoyCreated,
  vehicleJoinedConvoy,
  vehicleGoalSet,
  convoyGoalSet,
  convoyUpdated,
  convoyDock,
  convoyUnDock,
  inventoryUpdate,
}

export type DBEvent = {
  type: DBEvents;
  data?: unknown;
};

export type CityPositionProperty = {
  name: string;
  type: string;
  ID: ID;
};

export type VehicleType = {
  name: string;
  desc: string;
  ID: ID;
  price: number;
  type: string;
};

export type VehicleInsertData = {
  name: string;
  type: number;
  posX: number;
  posY: number;
};

export type TradeRouteInsertData = {
  cityA: number;
  cityB: number;
  name: string;
};

export type ConvoyInsertData = {
  name: string;
  type: string;
  posX: number;
  posY: number;
};
