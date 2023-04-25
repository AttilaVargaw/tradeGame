import { ResourceChange } from "./tables/common";

export type DailyRequirement = {
  num: number;
  itemID: number;
  nameKey: string;
  ID: number;
  dailyRequirementID: number;
  dailyRequirement: number;
  descriptionKey: number;
  translation: string;
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

export type IndustrialBuilding = {
  buildingNum: number;
  nameKey: string;
  ID: number;
  inputOutputData: ResourceChange[];
};

export type WarehouseItem = {
  ID: number;
  number: number;
  city: string;
  nameKey: string;
  dailyRequirement: number;
  itemID: number;
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
  newVehicleBought,
  newConvoyCreated,
  vehicleJoinedConvoy,
  vehicleGoalSet,
  convoyGoalSet,
  convoyUpdated,
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

export type VehicleType = {
  name: string;
  desc: string;
  ID: number;
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
