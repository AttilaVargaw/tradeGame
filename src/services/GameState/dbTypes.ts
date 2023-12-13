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
