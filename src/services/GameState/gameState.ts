import { createContext } from "react";
import { creatorSQL } from "../creatorSQL";

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
  Convoy,
  Vehicle,
} from "./dbTypes";
import { getQuery } from "./queryManager";
import groupBy from "lodash-es/groupBy";
import Database from "tauri-plugin-sql-api";
import { makeid } from "@Services/utils";
import vehicleTypes from "./tables/vehicleTypes";
import { ResourceChange, TableData, Tables } from "./tables/common";
import City, { CityEntity, IndustryData } from "./tables/City";
import CityTypes from "./tables/CityTypes";
import ClassDailyRequirements from "./tables/ClassDailyRequirement";
import PopulationClasses, { PopulationClass } from "./tables/PopulationClass";
import CityPopulationClass, {
  CityPopulationClassData,
} from "./tables/CityPopulationClass";

let db: Database;

const dbObservable = new BehaviorSubject<DBEvent>({ type: DBEvents.NOP });

async function CreateAndFillTable<T>({
  createData,
  name,
  initData,
}: TableData<T>) {
  await db
    .execute(create(name, createData))
    .then(console.log)
    .catch((e) => console.error(e, name, createData));

  if (initData) {
    return Promise.all(
      initData.map((attributes) => {
        return db
          .execute(insert({ table: name, attributes } as InsertEvent))
          .then(() => console.log(name, attributes))
          .catch((e) => console.error(e, name, attributes));
      })
    );
  } else {
    return Promise.resolve();
  }
}

const init = async () => {
  db = await Database.load("sqlite:tradegame.db");

  await db.execute("PRAGMA foreign_keys=OFF;");

  await CreateAndFillTable(CityTypes);
  await CreateAndFillTable(ClassDailyRequirements);
  await CreateAndFillTable(PopulationClasses);
  await CreateAndFillTable(vehicleTypes);
  await CreateAndFillTable(City);
  await CreateAndFillTable(CityPopulationClass);

  await Promise.all([
    db.execute(
      create(Tables.TradeRoutes, [
        { name: "CityA", type: "INTEGER", references: "City" },
        { name: "CityB", type: "INTEGER", references: "City" },
        { name: "name", type: "TEXT" },
      ])
    ),
    db.execute(
      create(Tables.Convoy, [
        { name: "name", type: "TEXT" },
        { name: "posY", type: "REAL" },
        { name: "posX", type: "REAL" },
      ])
    ),
    db.execute(
      create(Tables.Vehicle, [
        { name: "name", type: "TEXT" },
        {
          name: "type",
          type: "TEXT",
          references: "VehicleTypes",
          referencesOn: "ID",
        },
        { name: "posY", type: "REAL" },
        { name: "posX", type: "REAL" },
        {
          name: "convoy",
          type: "INTEGER",
          references: "Convoy",
          referencesOn: "ID",
        },
      ])
    ),
  ]);

  await db.execute(creatorSQL);

  await db.execute("PRAGMA foreign_keys=OFF;");

  dbObservable.next({ type: DBEvents.initialized });
};

async function CreateConvoy(name: string) {
  const data = await db.execute(
    insert({
      table: Tables.Convoy,
      attributes: { name, type: "" },
    })
  );
}

function GenerateVehicleName() {
  return `${makeid(3)}-${makeid(3)}`;
}

const addVehicleToConvoy = async (convoyID: number, VehicleID: number) => {
  const data = await db.execute(
    update({
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "ID"], value: VehicleID }],
      updateRows: [[Tables.Vehicle, "convoy", convoyID]],
    })
  );

  dbObservable.next({ type: DBEvents.newVehicleBought, data });
};

async function GetVehicleCount() {
  return (
    await db.select<{ "count(ID)": number }[]>(
      select({
        table: Tables.Vehicle,
        attributes: [["", "count(ID)"]],
      })
    )
  )[0]["count(ID)"];
}

const addVehicle = async (type: number) => {
  const data = await db.execute(
    insert({
      table: Tables.Vehicle,
      attributes: { name: GenerateVehicleName(), posX: 0, posY: 0, type },
    })
  );

  dbObservable.next({ type: DBEvents.newVehicleBought, data });
};

const getVehicleTypes = (type: string) => {
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

const getVehicleType = (ID: number) => {
  return db.select<VehicleType[]>(
    select({
      attributes: [[Tables.VehicleTypes, ["name", "desc", "ID", "price"]]],
      table: Tables.VehicleTypes,
      where: [{ A: [Tables.VehicleTypes, "ID"], value: ID }],
    })
  );
};

const getConvoys = () => {
  return db.select<Convoy[]>(
    select({
      attributes: [[Tables.Convoy, ["name", "ID"]]],
      table: Tables.Convoy,
    })
  );
};

const getVehiclesOfConvoy = (ID: number | null) => {
  return db.select<Vehicle[]>(
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

const getConvoylessVehicles = () => {
  console.log(
    select({
      attributes: [[Tables.Vehicle, ["name", "ID"]]],
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "convoy"], value: null, operator: " is " }],
    })
  );

  return db.select<Vehicle[]>(
    select({
      attributes: [[Tables.Vehicle, ["name", "ID"]]],
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "convoy"], value: null, operator: " is " }],
    })
  );
};

export type TradeRouteView = {
  name: string;
  ID: number;
  cityAID: number;
  cityBID: number;
  cityAName: string;
  cityBName: string;
};

const getTradeRoute = async (ID: number) => {
  const { cityAID, cityBID, name } = (
    await db.select<TradeRouteView[]>(
      select({
        attributes: [
          ["cityB", ["ID", "name"]],
          ["cityA", ["ID", "name"]],
          [Tables.TradeRoutes, ["name", "ID"]],
        ],
        table: Tables.TradeRoutes,
        where: [{ A: [Tables.TradeRoutes, "ID"], value: ID }],
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
      }).replace("cityA,", "cityA")
    )
  )[0];

  return {
    cities: [cityAID, cityBID],
    ID,
    name,
  } as TradeRouteProps;
};

export type TradeRouteAsGeoJSONView = {
  cityAPosX: number;
  cityBPosX: number;
  cityAPosY: number;
  cityBPosY: number;
  name: string;
  ID: number;
  cityAID: number;
  cityBID: number;
  cityAName: string;
  cityBName: string;
};

const getTradeRoutesAsGeoJson = async () => {
  const tradeRoutes = await db.select<TradeRouteAsGeoJSONView[]>(
    select({
      table: Tables.TradeRoutes,
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
    }).replace("cityA,", "cityA")
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
            [cityAPosX, cityAPosY],
            [cityBPosX, cityBPosY],
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

const addTradeRoute = async ([cityA, cityB]: (number | null)[]) => {
  if (cityA && cityB) {
    const [start, end] = await Promise.all([cityA, cityB].map(getCity));

    const data = await db.execute(
      insert({
        table: Tables.TradeRoutes,
        attributes: { cityA, cityB, name: `${start.name}, ${end.name} route` },
      })
    );

    dbObservable.next({ type: DBEvents.tradeRouteUpdate, data });
  }
};

const getCitiesAsGeoJson = async () => {
  console.log(getQuery("getCities"));
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

const getCityIndustrialBuildings = async (ID: number) => {
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

const getCity = async (ID: number): Promise<CityEntity> => {
  const [cityData, classes, warehouse] = await Promise.all([
    db.select<CityEntity[]>(getQuery("getCity"), [ID]),
    getPopulation(ID),
    getCityWarehouse(ID),
  ]);

  await Promise.all(
    classes.map(
      async (e) =>
        (e.dailyRequirement = await getCityDailyConsumption(ID, e.ID))
    )
  );

  return {
    ...cityData[0],
    classes,
    industry: {
      industrialBuildings: await getCityIndustrialBuildings(ID),
      aggregatedInputOutput: await getCityIndustrialResourceChanges(ID),
    },
    warehouse,
    fullPopulation: classes.reduce((p, { num }) => p + num, 0),
  };
};

const getNotExistingCityClasses = async (cityID: number) => {
  const [cityPopulationClasses, populationClasses] = await Promise.all([
    db.select<CityPopulationClassData[]>(
      `
    select CPC.ID, CPC.populationClass
        from CityPopulationClass as CPC
        where CPC.city = ?
    `,
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

const addCityClass = (cityID: number, cityClassID: number) => {
  return db.execute(
    `insert into CityPopulationClass (num, populationClass, city) values (0, $1, $2)`,
    [cityClassID, cityID]
  );
};

const updateCityWarehouseItem = (number: number, ID: number) => {
  return db.execute(`update CityWarehouse set number = $1 where ID = $2`, [
    number,
    ID,
  ]);
};

const addCityWarehouseItem = (item: number, number: number, cityID: number) => {
  return db.execute(
    `insert into CityWarehouse (city, item, number) values ($1, $2, $3)`,
    [cityID, item, number]
  );
};

const getCityDailyConsumption = (ID: number, classID: number) => {
  return db.select<DailyRequirement[]>(
    `select CDR.num as dailyRequirement, CPC.num, CDR.item, I.nameKey, PC.name, CDR.ID as dailyRequirementID, I.descriptionKey
        from City as C
        inner join CityPopulationClass as CPC on C.ID = CPC.city
        inner join PopulationClass as PC on PC.ID = CPC.populationClass
        inner join ClassDailyRequirement as CDR on CDR.Class = PC.ID
        inner join Item as I on I.ID = CDR.item
        where C.ID = $1 AND PC.ID = $2`,
    [ID, classID]
  );
};

const setPopulation = (ID: number, num: number) => {
  return db.execute(`update CityPopulationClass set num = $1 where ID = $2;`, [
    num,
    ID,
  ]);
};

const getPopulation = (ID: number) => {
  return db.select<PopulationData[]>(
    `select num, PopulationClass.name, PopulationClass.ID
            from City inner join CityPopulationClass on City.ID = CityPopulationClass.city 
            inner join PopulationClass on CityPopulationClass.populationClass = PopulationClass.ID
            where City.ID = $1 
            group by PopulationClass.name`,
    [ID]
  );
};

const getCityWarehouse = (CityID: number) => {
  return db.select<WarehouseItem[]>(
    `select I.nameKey, I.descriptionKey, CW.number, CW.ID, I.ID as item
                from City as C
                inner join CityWarehouse as CW on CW.city = C.ID
                inner join Item as I on I.ID = CW.item
                where C.ID = $1`,
    [CityID]
  );
};

// ?
const getNotAvailableItems = async (cityID: number) => {
  const [items, warehouse] = await Promise.all([
    db.select<Item[]>(`select I.nameKey, I.descriptionKey, I.ID
        from Item as I`),
    db.select<WarehouseItem[]>(
      `select I.nameKey, I.descriptionKey, CW.number, I.ID
        from City as C
        inner join CityWarehouse as CW on CW.city = C.ID
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

const getCityIndustryData = (ID: number) => {
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
const getCityIndustrialBuildingResourceChanges = async (ID: number) => {
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

const getCityIndustrialResourceChanges = async (ID: number) => {
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
        ID: number;
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

const getAllIndustrialBuildings = () => {
  return db.select<IndustrialBuilding[]>(
    `select IB.ID, IB.nameKey from IndustrialBuilding as IB`
  );
};

const addIndustrialBuildings = (
  num: number,
  industrialBuilding: string,
  city: number
) => {
  return db.select<IndustrialBuilding[]>(
    `insert into IndustrialBuildings (num, industrialBuilding, city) values ($1, $2, $3)`,
    [num, industrialBuilding, city]
  );
};

const initialized = () => {
  return typeof db !== "undefined";
};

const setIndustrialBuildingNumber = (ID: number, num: number) => {
  return db.execute(`update IndustrialBuildings set num = $1 where ID = $2;`, [
    num,
    ID,
  ]);
};

export const GameState = {
  initialized,
  setIndustrialBuildingNumber,
  getNotAvailableItems,
  getCity,
  getCityDailyConsumption,
  getCityIndustryData,
  getCityWarehouse,
  updateCityWarehouseItem,
  init,
  setPopulation,
  getNotExistingCityClasses,
  addCityClass,
  addCityWarehouseItem,
  getAllIndustrialBuildings,
  addIndustrialBuildings,
  getCityIndustrialBuildings,
  getCityIndustrialResourceChanges,
  getCityIndustrialBuildingResourceChanges,
  getCitiesAsGeoJson,
  getTradeRoutesAsGeoJson,
  addTradeRoute,
  dbObservable: dbObservable.asObservable(),
  getTradeRoute,
  getConvoys,
  getVehiclesOfConvoy,
  getVehicleTypes,
  getVehicleType,
  addVehicle,
  getConvoylessVehicles,
  addVehicleToConvoy,
  CreateConvoy,
  GetVehicleCount,
};

export const GameStateContext = createContext(GameState);
