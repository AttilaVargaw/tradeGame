import { BehaviorSubject } from "rxjs";
import Database from "tauri-plugin-sql-api";

import { path } from "@tauri-apps/api";

import { creatorSQL } from "../creatorSQL";
import { DBEvent, DBEvents } from "./dbTypes";
import City from "./tables/City/CityTable";
import CityPopulationClass from "./tables/CityPopulationClass";
import CityTypes from "./tables/CityTypes/CityTypes";
import ClassDailyRequirements from "./tables/ClassDailyRequirement";
import Convoy from "./tables/Convoy/Convoy";
import Encyclopedia from "./tables/Encyclopedia";
import IndustrialBuildingDailyRequirement from "./tables/IndustrialBuildingDailyRequirement";
import Inventory from "./tables/Inventory/Inventory";
import PopulationClasses from "./tables/PopulationClass";
import ShippingPlan from "./tables/ShippingPlan/ShippingPlan";
import ShippingPlanExchange from "./tables/ShippingPlan/ShippingPlanExchange";
import ShippingPlanRoutes from "./tables/ShippingPlan/ShippingPlanRoutes";
import TradeRoutes from "./tables/TradeRoutes";
import Vehicle from "./tables/Vehicle/Vehicle";
import vehicleTypes from "./tables/vehicleTypes";
import { DropTableIfExist, FillTable, create } from "./utils/SimpleQueryBuider";

export let db: Database;

export const dbObservable = new BehaviorSubject<DBEvent>({
  type: DBEvents.NOP,
});

const inMemory = false;

export const init = async () => {
  db = await Database.load(inMemory ? "sqlite:memory" : "sqlite:tradegame.db");
  console.log(await path.appLocalDataDir());

  const creatorSQL1 =
    "PRAGMA foreign_keys=OFF;" +
    DropTableIfExist(CityTypes.name) +
    DropTableIfExist(ClassDailyRequirements.name) +
    DropTableIfExist(PopulationClasses.name) +
    DropTableIfExist(vehicleTypes.name) +
    DropTableIfExist(City.name) +
    DropTableIfExist(CityPopulationClass.name) +
    DropTableIfExist("TradeRoutes") +
    DropTableIfExist("Convoy") +
    DropTableIfExist("Vehicle") +
    DropTableIfExist(Encyclopedia.name) +
    DropTableIfExist(IndustrialBuildingDailyRequirement.name) +
    DropTableIfExist(ShippingPlan.name) +
    DropTableIfExist(ShippingPlanExchange.name) +
    DropTableIfExist(Inventory.name);
  DropTableIfExist(ShippingPlanRoutes.name);

  const creatorSQL2 =
    "BEGIN TRANSACTION;" +
    create(CityTypes.name, CityTypes.createData) +
    create(ClassDailyRequirements.name, ClassDailyRequirements.createData) +
    create(PopulationClasses.name, PopulationClasses.createData) +
    create(vehicleTypes.name, vehicleTypes.createData) +
    create(City.name, City.createData) +
    create(CityPopulationClass.name, CityPopulationClass.createData) +
    create(TradeRoutes.name, TradeRoutes.createData) +
    create(Convoy.name, Convoy.createData) +
    create(Vehicle.name, Vehicle.createData) +
    create(Encyclopedia.name, Encyclopedia.createData) +
    create(Inventory.name, Inventory.createData) +
    create(ShippingPlan.name, ShippingPlan.createData) +
    create(ShippingPlanExchange.name, ShippingPlanExchange.createData) +
    create(ShippingPlanRoutes.name, ShippingPlanRoutes.createData) +
    create(
      IndustrialBuildingDailyRequirement.name,
      IndustrialBuildingDailyRequirement.createData
    ) +
    "COMMIT;";

  const creatorSQL3 =
    "BEGIN TRANSACTION;" +
    FillTable(CityTypes) +
    FillTable(ClassDailyRequirements) +
    FillTable(PopulationClasses) +
    FillTable(vehicleTypes) +
    FillTable(City) +
    FillTable(CityPopulationClass) +
    FillTable(Encyclopedia) +
    FillTable(Vehicle) +
    FillTable(Convoy) +
    FillTable(IndustrialBuildingDailyRequirement) +
    FillTable(TradeRoutes) +
    FillTable(Inventory) +
    FillTable(ShippingPlanExchange) +
    FillTable(ShippingPlan) +
    FillTable(ShippingPlanRoutes) +
    "COMMIT;";

  await Promise.all([
    db.execute(creatorSQL1),
    db.execute(creatorSQL2),
    db.execute(creatorSQL3),
    db.execute(creatorSQL),
  ]);

  dbObservable.next({ type: DBEvents.initialized });
  dbObservable.next({ type: DBEvents.tradeRouteUpdate });
  dbObservable.next({ type: DBEvents.convoyUpdated });
  dbObservable.next({ type: DBEvents.cityWarehouseUpdate });
  dbObservable.next({ type: DBEvents.cityPopulationUpdate });
};
