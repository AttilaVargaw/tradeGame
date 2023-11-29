import { BehaviorSubject } from "rxjs";
import Database from "tauri-plugin-sql-api";

import { appLocalDataDir } from "@tauri-apps/api/path";

import { creatorSQL } from "../creatorSQL";
import { DBEvent, DBEvents } from "./dbTypes";
import City from "./tables/City/CityTable";
import CityPopulationClass from "./tables/CityPopulationClass";
import CityTypes from "./tables/CityTypes/CityTypes";
import ClassDailyRequirements from "./tables/ClassDailyRequirement";
import Convoy from "./tables/Convoy/Convoy";
import Encyclopedia from "./tables/Encyclopedia";
import IndustrialBuildingDailyRequirement from "./tables/IndustrialBuildingDailyRequirement";
import PopulationClasses from "./tables/PopulationClass";
import TradeRoutes from "./tables/TradeRoutes";
import Vehicle from "./tables/Vehicle/Vehicle";
import { Tables } from "./tables/common";
import vehicleTypes from "./tables/vehicleTypes";
import {
  DropTableIfExist,
  FillTable,
  create,
} from "./utils/simpleQueryBuilder";

export let db: Database;

export const dbObservable = new BehaviorSubject<DBEvent>({
  type: DBEvents.NOP,
});

const inMemory = false;

export const init = async () => {
  db = await Database.load(inMemory ? "sqlite:memory" : "sqlite:tradegame.db");
  console.log(await appLocalDataDir());

  const creatorSQL1 =
    "PRAGMA foreign_keys=OFF;" +
    DropTableIfExist(CityTypes.name) +
    DropTableIfExist(ClassDailyRequirements.name) +
    DropTableIfExist(PopulationClasses.name) +
    DropTableIfExist(vehicleTypes.name) +
    DropTableIfExist(City.name) +
    DropTableIfExist(CityPopulationClass.name) +
    DropTableIfExist(Tables.TradeRoutes) +
    DropTableIfExist(Tables.Convoy) +
    DropTableIfExist(Tables.Vehicle) +
    DropTableIfExist(Encyclopedia.name) +
    DropTableIfExist(IndustrialBuildingDailyRequirement.name);

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
    "COMMIT;";

  await db.execute(creatorSQL1);
  console.log("creatorSQL1");

  await db.execute(creatorSQL2);
  console.log("creatorSQL2");

  await db.execute(creatorSQL3);
  console.log("creatorSQL3");

  await db.execute(creatorSQL);

  dbObservable.next({ type: DBEvents.initialized });
  dbObservable.next({ type: DBEvents.tradeRouteUpdate });
  dbObservable.next({ type: DBEvents.convoyUpdated });
  dbObservable.next({ type: DBEvents.cityWarehouseUpdate });
  dbObservable.next({ type: DBEvents.cityPopulationUpdate });
};
