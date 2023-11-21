import { creatorSQL } from "../creatorSQL";

import { appLocalDataDir } from "@tauri-apps/api/path";

import { BehaviorSubject } from "rxjs";

import {
  InsertEvent,
  create,
  insert,
  select,
  update,
} from "../simpleQueryBuilder";
import {
  TradeRouteProps,
  DailyRequirement,
  DBEvents,
  IndustrialBuilding,
  Item,
  PopulationData,
  WarehouseItem,
  CityPositionProperty,
  DBEvent,
  VehicleType,
  ID,
} from "./dbTypes";
import { getQuery } from "./queryManager";
import groupBy from "lodash-es/groupBy";
import Database from "tauri-plugin-sql-api";
import vehicleTypes from "./tables/vehicleTypes";
import { ResourceChange, TableData, Tables } from "./tables/common";
import City, { CityEntity, IndustryData } from "./tables/City";
import CityTypes from "./tables/CityTypes";
import ClassDailyRequirements from "./tables/ClassDailyRequirement";
import PopulationClasses, { PopulationClass } from "./tables/PopulationClass";
import CityPopulationClass, {
  CityPopulationClassData,
} from "./tables/CityPopulationClass";
import TradeRoutes from "./tables/TradeRoutes";
import Convoy, { ConvoyData } from "./tables/Convoy";
import Vehicle, { VehicleData } from "./tables/Vehicle";
import Encyclopedia, { EncyclopediaData } from "./tables/Encyclopedia";
import IndustrialBuildingDailyRequirement from "./tables/IndustrialBuildingDailyRequirement";
import { Lenght } from "@Services/utils";
import { Translations } from "./tables/Translations";

let db: Database;

export const dbObservable = new BehaviorSubject<DBEvent>({
  type: DBEvents.NOP,
});

function DropTableIfExist(tableName: string) {
  return `drop table if exists ${tableName};`;
}

function FillTable<T>({ name, initData }: TableData<T>) {
  if (initData) {
    return initData
      .map((attributes) => insert({ table: name, attributes } as InsertEvent))
      .join("");
  }
  return "";
}

export const init = async () => {
  //db = await Database.load("sqlite:tradegame.db");ű
  db = await Database.load("sqlite:memory");
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

export async function CreateConvoy(name: string) {
  const data = await db.execute(
    insert({
      table: Tables.Convoy,
      attributes: { name, type: "", posX: 0, posY: 0 },
    })
  );

  dbObservable.next({ type: DBEvents.newConvoyCreated, data });

  return data.lastInsertId;
}

export const setConvoyGoal = async (
  convoyID: ID,
  goalX: number,
  goalY: number
) => {
  const data = await db.execute(
    update({
      table: Tables.Convoy,
      where: [{ A: [Tables.Convoy, "ID"], value: convoyID }],
      updateRows: [
        ["goalX", goalX],
        ["goalY", goalY],
      ],
    })
  );

  dbObservable.next({ type: DBEvents.convoyGoalSet, data });
};

export const setVehicleGoal = async (
  ID: ID,
  goalX: number,
  goalY: number
) => {
  const data = await db.execute(
    update({
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "ID"], value: ID }],
      updateRows: [
        ["goalX", goalX],
        ["goalY", goalY],
      ],
    })
  );

  dbObservable.next({ type: DBEvents.vehicleGoalSet, data });
};

export const addVehicleToConvoy = async (
  convoyID: ID,
  VehicleID: ID
) => {
  const data = await db.execute(
    update({
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "ID"], value: VehicleID }],
      updateRows: [["convoy", convoyID]],
    })
  );

  dbObservable.next({ type: DBEvents.vehicleJoinedConvoy, data });
};

export async function GetVehicleCount() {
  return (
    await db.select<{ "count(ID)": number }[]>(
      select({
        table: Tables.Vehicle,
        attributes: [["", "count(ID)"]],
      })
    )
  )[0]["count(ID)"];
}

export function GetEncyclopediaArticles(parent: number | null) {
  return db.select<EncyclopediaData[]>(
    select({
      table: Tables.Encyclopedia,
      attributes: [
        [Tables.Encyclopedia, "ID"],
        [Tables.Encyclopedia, "body"],
        [Tables.Encyclopedia, "name"],
        [Tables.Encyclopedia, "folder"],
      ],
      where: [
        {
          A: [Tables.Encyclopedia, "parent"],
          value: parent,
          operator: parent === null ? " is " : "=",
        },
      ],
    })
  );
}

export async function GetConvoiyCount() {
  return (
    await db.select<{ "count(ID)": number }[]>(
      select({
        table: Tables.Convoy,
        attributes: [["", "count(ID)"]],
      })
    )
  )[0]["count(ID)"];
}

export async function GetTraderouteCount() {
  return (
    await db.select<{ "count(ID)": number }[]>(
      select({
        table: Tables.TradeRoutes,
        attributes: [["", "count(ID)"]],
      })
    )
  )[0]["count(ID)"];
}

export const addVehicle = async (type: number, name: string) => {
  const data = await db.execute(
    insert({
      table: Tables.Vehicle,
      attributes: { name, posX: 0, posY: 0, type },
    })
  );

  dbObservable.next({ type: DBEvents.newVehicleBought, data });
};

export const getVehicleTypes = (type: string) => {
  return db.select<VehicleType[]>(
    select({
      table: Tables.VehicleTypes,
      attributes: [
        [Tables.VehicleTypes, ["price", "ID", "desc", "name", "type"]],
      ],
      where: [{ A: [Tables.VehicleTypes, "type"], value: type }],
    })
  );
};

export const getVehicleType = (ID: ID) => {
  return db.select<VehicleType[]>(
    select({
      attributes: [[Tables.VehicleTypes, ["name", "desc", "ID", "price"]]],
      table: Tables.VehicleTypes,
      where: [{ A: [Tables.VehicleTypes, "ID"], value: ID }],
    })
  );
};

export const getConvoys = () => {
  return db.select<ConvoyData[]>(
    select({
      attributes: [
        [
          Tables.Convoy,
          ["name", "ID", "route", "posY", "posX", "goalX", "goalY", "dockedTo"],
        ],
      ],
      table: Tables.Convoy,
    })
  );
};

export const setConvoyTradeRoute = async (
  ID: ID,
  routeID: ID | null
) => {
  const data = await db.execute(
    update({
      table: Tables.Convoy,
      updateRows: [["route", routeID]],
      where: [{ A: [Tables.Convoy, "ID"], value: ID }],
    })
  );

  dbObservable.next({ type: DBEvents.convoyUpdated, data });
};

export const getConvoy = async (ID: ID) => {
  return (
    await db.select<ConvoyData[]>(
      select({
        attributes: [[Tables.Convoy, ["name", "ID", "route", "posY", "posX"]]],
        table: Tables.Convoy,
        where: [{ A: [Tables.Convoy, "ID"], value: ID }],
      })
    )
  )[0];
};

export const getVehicles = () => {
  return db.select<VehicleData[]>(
    select({
      attributes: [[Tables.Vehicle, ["ID", "name", "posY", "posX", "convoy"]]],
      table: Tables.Vehicle,
    })
  );
};

export const getVehiclesOfConvoy = (ID: ID | null) => {
  return db.select<VehicleData[]>(
    select({
      attributes: [[Tables.Vehicle, ["name", "ID"]]],
      table: Tables.Vehicle,
      join: [
        {
          A: Tables.Convoy,
          equation: { A: [Tables.Convoy, "ID"], B: [Tables.Vehicle, "convoy"] },
        },
      ],
      where: [{ A: [Tables.Vehicle, "convoy"], value: ID }],
    })
  );
};

export const getConvoylessVehicles = () => {
  return db.select<VehicleData[]>(
    select({
      attributes: [[Tables.Vehicle, ["name", "ID"]]],
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "convoy"], value: null, operator: " is " }],
    })
  );
};

export type TradeRouteView = {
  name: string;
  ID: ID;
  cityAID: ID;
  cityBID: ID;
  cityAName: string;
  cityBName: string;
};

export const getTradeRoute = (ID?: number) => {
  return db.select<TradeRouteAsGeoJSONView[]>(
    select({
      table: Tables.TradeRoutes,
      where: ID ? [{ A: [Tables.TradeRoutes, "ID"], value: ID }] : undefined,
      attributes: [
        [
          "CityA",
          [
            ["ID", "cityAID"],
            ["name", "cityAName"],
            ["posX", "cityAPosX"],
            ["posY", "cityAPosY"],
          ],
        ],
        [
          "CityB",
          [
            ["ID", "cityBID"],
            ["name", "cityBName"],
            ["posX", "cityBPosX"],
            ["posY", "cityBPosY"],
          ],
        ],
        [Tables.TradeRoutes, ["name", "ID"]],
      ],
      join: [
        {
          A: Tables.City,
          equation: {
            A: ["CityA", "ID"],
            B: [Tables.TradeRoutes, "cityA"],
            operator: "=",
          },
          as: "CityA",
        },
        {
          A: Tables.City,
          equation: {
            A: ["CityB", "ID"],
            B: [Tables.TradeRoutes, "cityB"],
            operator: "=",
          },
          as: "CityB",
        },
      ],
    })
  );
};

export type TradeRouteAsGeoJSONView = {
  cityAPosX: number;
  cityBPosX: number;
  cityAPosY: number;
  cityBPosY: number;
  name: string;
  ID: ID;
  cityAID: ID;
  cityBID: ID;
  cityAName: string;
  cityBName: string;
};

export const getTradeRoutesAsGeoJson = async (ID?: number) => {
  const tradeRoutes = await db.select<TradeRouteAsGeoJSONView[]>(
    select({
      table: Tables.TradeRoutes,
      where: ID ? [{ A: [Tables.TradeRoutes, "ID"], value: ID }] : undefined,
      attributes: [
        [
          "CityA",
          [
            ["ID", "cityAID"],
            ["name", "cityAName"],
            ["posX", "cityAPosX"],
            ["posY", "cityAPosY"],
          ],
        ],
        [
          "CityB",
          [
            ["ID", "cityBID"],
            ["name", "cityBName"],
            ["posX", "cityBPosX"],
            ["posY", "cityBPosY"],
          ],
        ],
        [Tables.TradeRoutes, ["name", "ID"]],
      ],
      join: [
        {
          A: Tables.City,
          equation: {
            A: ["CityA", "ID"],
            B: [Tables.TradeRoutes, "cityA"],
            operator: "=",
          },
          as: "CityA",
        },
        {
          A: Tables.City,
          equation: {
            A: ["CityB", "ID"],
            B: [Tables.TradeRoutes, "cityB"],
            operator: "=",
          },
          as: "CityB",
        },
      ],
    })
  );

  return tradeRoutes.reduce(
    (
      prev,
      { cityAPosY, cityAPosX, ID, cityBPosX, cityBPosY, name, cityAID, cityBID }
    ) => {
      prev.features.push({
        geometry: {
          type: "LineString",
          coordinates: [
            [cityAPosY, cityAPosX],
            [cityBPosY, cityBPosX],
          ],
        },
        properties: {
          cities: [cityAID, cityBID],
          name,
          ID,
        },
        type: "Feature",
      });

      return prev;
    },
    {
      features: [],
      type: "FeatureCollection",
    } as GeoJSON.FeatureCollection<GeoJSON.LineString, TradeRouteProps>
  );
};

export const addTradeRoute = async ([cityA, cityB]: (number | null)[]) => {
  if (cityA && cityB) {
    const [start, end] = await Promise.all([cityA, cityB].map(getCity));

    const data = await db.execute(
      insert({
        table: Tables.TradeRoutes,
        attributes: { cityA, cityB, name: `${start.name}, ${end.name} route` },
      })
    );

    dbObservable.next({ type: DBEvents.tradeRouteAdded, data });
  }
};

export const getConvoysAsGeoJson = async () => {
  const convoysData = await db.select<ConvoyData[]>(
    select({
      attributes: [
        [Tables.Convoy, "posX"],
        [Tables.Convoy, "posY"],
        [Tables.Convoy, "ID"],
        [Tables.Convoy, "type"],
        [Tables.Convoy, "name"],
      ],
      table: Tables.Convoy,
    })
  );

  return {
    type: "FeatureCollection",
    features: convoysData.map(({ posX, posY, name, ID }) => ({
      type: "Feature",
      geometry: {
        coordinates: [posX, posY],
        type: "Point",
      },
      properties: { name, type: "vehicle", ID },
    })),
  } as GeoJSON.FeatureCollection<GeoJSON.Point, ConvoyData>;
};

export const getConvoyGoalsAsGeoJson = async () => {
  const convoysData = await db.select<ConvoyData[]>(
    select({
      attributes: [
        [Tables.Convoy, "posX"],
        [Tables.Convoy, "posY"],
        [Tables.Convoy, "ID"],
        [Tables.Convoy, "goalX"],
        [Tables.Convoy, "goalY"],
      ],
      table: Tables.Convoy,
    })
  );

  return {
    type: "FeatureCollection",
    features: convoysData
      .filter(({ goalX, goalY }) => goalX && goalY)
      .map(({ goalX, goalY, posX, posY, ID }) => ({
        properties: { ID },
        type: "Feature",
        geometry: {
          coordinates: [
            [goalY, goalX],
            [posY, posX],
          ],
          type: "LineString",
        },
      })),
  } as GeoJSON.FeatureCollection<GeoJSON.LineString>;
};

export const getVehicleGoalsAsGeoJson = async () => {
  const convoysData = await db.select<VehicleData[]>(
    select({
      attributes: [
        [Tables.Vehicle, "posX"],
        [Tables.Vehicle, "posY"],
        [Tables.Vehicle, "ID"],
        [Tables.Vehicle, "goalY"],
        [Tables.Vehicle, "goalX"],
      ],
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "convoy"], value: null, operator: " is " }],
    })
  );

  return {
    type: "FeatureCollection",
    features: convoysData
      .filter(({ goalX, goalY }) => goalX && goalY)
      .map(({ goalX, goalY, posX, posY }) => ({
        type: "Feature",
        geometry: {
          coordinates: [
            [goalX, goalY],
            [posX, posY],
          ],
          type: "LineString",
        },
      })),
  } as GeoJSON.FeatureCollection<GeoJSON.LineString>;
};

export const getVehiclesAsGeoJson = async () => {
  const vehicleData = await db.select<VehicleData[]>(
    select({
      attributes: [
        [Tables.Vehicle, "posX"],
        [Tables.Vehicle, "posY"],
        [Tables.Vehicle, "ID"],
        [Tables.Vehicle, "type"],
        [Tables.Vehicle, "name"],
      ],
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "convoy"], value: null, operator: " is " }],
    })
  );

  return {
    type: "FeatureCollection",
    features: vehicleData.map(({ posX, posY, name, ID }) => ({
      type: "Feature",
      geometry: {
        coordinates: [posX, posY],
        type: "Point",
      },
      properties: { name, type: "vehicle", ID },
    })),
  } as GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>;
};

export const getCitiesAsGeoJson = async () => {
  const citiesData = await db.select<CityEntity[]>(getQuery("getCities"));

  return {
    type: "FeatureCollection",
    features: citiesData.map(({ posX, posY, name, type, ID }) => ({
      type: "Feature",
      geometry: {
        coordinates: [posX, posY],
        type: "Point",
      },
      properties: { name, type, ID },
    })),
  } as GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>;
};

export const getCities = () => {
  return db.select<CityEntity[]>(getQuery("getCities"));
};

export const getCityIndustrialBuildings = async (ID: ID) => {
  const industrialBuildings = await db.select<IndustrialBuilding[]>(
    `select IBS.ID, IBS.num as buildingNum, IB.nameKey
        from IndustrialBuilding as IB
        inner join IndustrialBuildings as IBS on IB.ID = IBS.industrialBuilding
        inner join City as C on C.ID = IBS.city
        where C.ID = $1`,
    [ID]
  );

  await Promise.all(
    industrialBuildings.map(async (e) => {
      const inputOutputData = await getCityIndustrialBuildingResourceChanges(
        e.ID
      );
      e.inputOutputData = inputOutputData;
    })
  );

  return industrialBuildings;
};

export const getCity = async (ID: ID): Promise<CityEntity> => {
  const cityData = (
    await db.select<CityEntity[]>(getQuery("getCity"), [ID])
  )[0];

  const [classes, warehouse] = await Promise.all([
    getPopulation(ID),
    getEntityInventory(cityData.entity),
  ]);

  await Promise.all(
    classes.map(
      async (e) =>
        (e.dailyRequirement = await getCityDailyConsumption(ID, e.ID))
    )
  );

  return {
    ...cityData,
    classes,
    industry: {
      industrialBuildings: await getCityIndustrialBuildings(ID),
      aggregatedInputOutput: await getCityIndustrialResourceChanges(ID),
    },
    warehouse,
    fullPopulation: classes.reduce((p, { num }) => p + num, 0),
  };
};

export const getNotExistingCityClasses = async (cityID: ID) => {
  const [cityPopulationClasses, populationClasses] = await Promise.all([
    db.select<CityPopulationClassData[]>(
      `select CPC.ID, CPC.populationClass
        from CityPopulationClass as CPC
        where CPC.city = ?`,
      [cityID]
    ),
    db.select<PopulationClass[]>(
      `select PC.name, PC.ID from PopulationClass as PC`
    ),
  ]);

  return populationClasses.filter((value) =>
    cityPopulationClasses.every(({ ID }) => value.ID !== ID)
  );
};

export const addCityClass = (cityID: ID, cityClassID: ID) => {
  return db.execute(
    `insert into CityPopulationClass (num, populationClass, city) values (0, $1, $2)`,
    [cityClassID, cityID]
  );
};

export const updateCityWarehouseItem = (number: number, ID: ID) => {
  return db.execute(`update Inventory set number = $1 where ID = $2`, [
    number,
    ID,
  ]);
};

export const addCityWarehouseItem = (
  item: number,
  number: number,
  cityID: ID
) => {
  return db.execute(
    `insert into Inventory (city, item, number) values ($1, $2, $3)`,
    [cityID, item, number]
  );
};

export const getCityDailyConsumption = (ID: ID, classID: ID) => {
  return db.select<DailyRequirement[]>(
    `select CDR.num as dailyRequirement, CPC.num, CDR.item, I.nameKey, PC.name, CDR.ID as dailyRequirementID, I.descriptionKey, T.translation
        from City as C
        inner join CityPopulationClass as CPC on C.ID = CPC.city
        inner join PopulationClass as PC on PC.ID = CPC.populationClass
        inner join ClassDailyRequirement as CDR on CDR.Class = PC.ID
        inner join Item as I on I.ID = CDR.item
        inner join Translations as T on I.nameKey = T.key
        where C.ID = $1 AND PC.ID = $2`,
    [ID, classID]
  );
};

export const setPopulation = (ID: ID, num: number) => {
  return db.execute(`update CityPopulationClass set num = $1 where ID = $2;`, [
    num,
    ID,
  ]);
};

export const getPopulation = (ID: ID) => {
  return db.select<PopulationData[]>(
    `select num, PopulationClass.name, PopulationClass.ID
            from City inner join CityPopulationClass on City.ID = CityPopulationClass.city 
            inner join PopulationClass on CityPopulationClass.populationClass = PopulationClass.ID
            where City.ID = $1 
            group by PopulationClass.name`,
    [ID]
  );
};

export const getEntityInventory = (entityID: ID) => {
  return db.select<WarehouseItem[]>(
    `select I.nameKey, I.descriptionKey, CW.number, CW.ID, I.ID as item
                from City as C
                inner join Inventory as CW on CW.entity = C.ID
                inner join Item as I on I.ID = CW.item
                where C.ID = $1`,
    [entityID]
  );
};

// ?
export const getNotAvailableItems = async (cityID: ID) => {
  const [items, warehouse] = await Promise.all([
    db.select<Item[]>(`select I.nameKey, I.descriptionKey, I.ID
        from Item as I`),
    db.select<WarehouseItem[]>(
      `select I.nameKey, I.descriptionKey, CW.number, I.ID
        from City as C
        inner join Inventory as CW on CW.entity = C.ID
        inner join Item as I on I.ID = CW.item
        where C.ID = $1`,
      [cityID]
    ),
  ]);

  return items
    .filter((value) => warehouse.every(({ ID }) => value.ID !== ID))
    .map(({ ID, descriptionKey, nameKey }) => ({
      ID,
      descriptionKey,
      nameKey,
    }));
};

export const getCityIndustryData = (ID: ID) => {
  return db.select<IndustryData[]>(
    `select IB.ID as buildingId, IB.nameKey as industrialBuildingNameKey, IBS.num as buildingNum
            from IndustrialBuildingDailyRequirement as IBR
            inner join IndustrialBuilding as IB on IBR.ID = IB.ID 
            inner join IndustrialBuildings as IBS on IB.ID = IBS.city
            inner join City on City.ID = IBS.ID
            where City.ID = $1
            group by IBR.item`,
    [ID]
  );
};

// majd ezt befejezni
export const getCityIndustrialBuildingResourceChanges = async (ID: ID) => {
  return (
    await db.select<(ResourceChange & { buildingNum: number })[]>(
      `select I.ID, IBR.num, I.nameKey, IBS.num as buildingNum
        from IndustrialBuildingDailyRequirement as IBR
        inner join IndustrialBuilding as IB on IBR.ID = IB.ID 
        inner join IndustrialBuildings as IBS on IB.ID = IBS.IndustrialBuilding
        inner join Item as I on IBR.item = I.ID
        where IBS.ID = $1`,
      [ID]
    )
  ).map((r) => {
    r.num = r.buildingNum * r.num;
    return r;
  });
};

export const getCityIndustrialResourceChanges = async (ID: ID) => {
  const aggregated = await db.select<
    (ResourceChange & { buildingNum: number })[]
  >(
    `select I.ID, IBR.num, I.nameKey, IBS.num as buildingNum
            from IndustrialBuildingDailyRequirement as IBR
            inner join IndustrialBuilding as IB on IBR.industrialBuilding = IB.ID 
            inner join IndustrialBuildings as IBS on IB.ID = IBS.industrialBuilding
            inner join City as C on C.ID = IBS.city
            inner join Item as I on IBR.item = I.ID
            where C.ID = ${ID}`,
    [ID]
  );

  return Object.entries(groupBy(aggregated, "nameKey")).map<ResourceChange>(
    ([key, coll]) => {
      const { descriptionKey, ID, num, buildingNum } = coll[0] as {
        descriptionKey: string;
        ID: ID;
        num: number;
        buildingNum: number;
      };

      return {
        num: num * buildingNum,
        nameKey: key,
        descriptionKey,
        ID,
      } as ResourceChange;
    }
  );
};

export const getAllIndustrialBuildings = () => {
  return db.select<IndustrialBuilding[]>(
    `select IB.ID, IB.nameKey from IndustrialBuilding as IB`
  );
};

export const addIndustrialBuildings = (
  num: number,
  industrialBuilding: string,
  city: number
) => {
  return db.select<IndustrialBuilding[]>(
    `insert into IndustrialBuildings (num, industrialBuilding, city) values ($1, $2, $3)`,
    [num, industrialBuilding, city]
  );
};

export const initialized = () => {
  return typeof db !== "undefined";
};

export const setIndustrialBuildingNumber = (ID: ID, num: number) => {
  return db.execute(`update IndustrialBuildings set num = $1 where ID = $2;`, [
    num,
    ID,
  ]);
};

export type ConvoyUpdateData = {
  minSpeed: number;
  dS: number;
  headingX: number;
  headingY: number;
  angle: number;
  goalVectorY: number;
  goalVectorX: number;
} & ConvoyData;

export async function UpdateConvoys(dt: number) {
  const convoys = await db.select<ConvoyData[]>(getQuery("getConvoys"));

  const ret = await Promise.all(
    convoys.map(
      async ({
        goalX,
        goalY,
        ID,
        posX,
        posY,
        goalVectorY,
        goalVectorX,
        dockedTo,
      }) => {
        if (goalX && goalY && goalVectorY && goalVectorX) {
          const [convoy] = await db.select<ConvoyUpdateData[]>(
            getQuery("getConvoySpeed"),
            [dt, ID]
          );

          dockedTo && dockConvoyToCity(ID, null);

          const angle = Math.atan2(goalVectorY, goalVectorX);

          const { headingX, headingY, dS } = convoy;

          const newPos = [
            posX - Math.cos(angle) * dS,
            posY - Math.sin(angle) * dS,
          ];

          const newVector = [posX - newPos[0], posY - newPos[1]];

          const stop =
            Lenght(headingX, headingY) - Lenght(newVector[0], newVector[1]) < 0;

          const updateRows: [string, number | null][] = [
            ["posX", stop ? goalX : newPos[0]],
            ["posY", stop ? goalY : newPos[1]],
          ];

          if (stop) {
            updateRows.push(["goalX", null]);
            updateRows.push(["goalY", null]);

            !dockedTo &&
              getCities().then((cities) =>
                cities.some(({ posX: cityX, posY: cityY, ID: cityID }) => {
                  goalX === cityX &&
                    goalY === cityY &&
                    dockConvoyToCity(ID, cityID);
                })
              );
          }

          await db.execute(
            update({
              table: Tables.Convoy,
              where: [{ A: [Tables.Convoy, "ID"], value: "?" }],
              updateRows,
            }),
            [ID]
          );

          return true;
        }

        return Promise.resolve(false);
      }
    )
  );

  return ret;
}

export async function getDockedConvoysForCity(cityID: ID) {
  const convoysData = await db.select<ConvoyData[]>(
    select({
      attributes: [
        [Tables.Convoy, "ID"],
        [Tables.Convoy, "name"],
      ],
      table: Tables.Convoy,
      where: [{ A: [Tables.Convoy, "dockedTo"], value: cityID, operator: "=" }],
    })
  );

  return convoysData;
}

export async function dockConvoyToCity(
  convoyID: ID,
  cityID: ID | null
) {
  await db.execute(
    update({
      table: Tables.Convoy,
      where: [{ A: [Tables.Convoy, "ID"], value: convoyID, operator: "=" }],
      updateRows: [["dockedTo", cityID]],
    })
  );

  dbObservable.next({
    type: cityID ? DBEvents.convoyDock : DBEvents.convoyUnDock,
  });
}

console.log(
  update({
    table: Tables.CityWarehouse,
    where: [{ A: [Tables.Convoy, "ID"], value: 0, operator: "=" }],
    updateRows: [["amount", "amount - 5"]],
  })
);

export async function moveBetweenInventories(
  inventoryAID: ID,
  inventoryBID: ID,
  amount: number
) {
  await Promise.all([
    db.execute(
      update({
        table: Tables.CityWarehouse,
        where: [
          { A: [Tables.Convoy, "ID"], value: inventoryAID, operator: "=" },
        ],
        updateRows: [["amount - ", amount]],
      })
    ),
    db.execute(
      update({
        table: Tables.CityWarehouse,
        where: [
          { A: [Tables.Convoy, "ID"], value: inventoryBID, operator: "=" },
        ],
        updateRows: [["amount + ", amount]],
      })
    ),
  ]);

  dbObservable.next({
    type: DBEvents.inventoryUpdate,
  });
}

export async function getAllItems() {
  const items = await db.select<(Item & Translations)[]>(
    select({
      table: Tables.Item,
      attributes: [
        [Tables.Item, "nameKey"],
        [Tables.Item, "descriptionKey"],
        [Tables.Item, "ID"],
        [Tables.Translations, "translation"],
        [Tables.Translations, "category"],
      ],
      join: [
        {
          A: Tables.Translations,
          equation: {
            A: [Tables.Item, "nameKey"],
            B: [Tables.Translations, "key"],
          },
        },
      ],
    })
  );

  return groupBy(items, "category");
}
