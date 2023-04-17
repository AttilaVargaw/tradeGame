import Database from "tauri-plugin-sql-api";
import { createContext } from "react";
import { creatorSQL } from "../creatorSQL";

import { BehaviorSubject } from "rxjs";

import { create, insert, select } from "../simpleQueryBuilder";
import {
  TradeRouteProps,
  City,
  CityPopulationClass,
  DailyRequirement,
  DBEvents,
  IndustrialBuilding,
  IndustryData,
  Item,
  PopulationClass,
  PopulationData,
  ResourceChange,
  WarehouseItem,
  CityPositionProperty,
  DBEvent,
  VehicleType,
  Tables,
} from "./dbTypes";
import { getQuery } from "./queryManager";
import groupBy from "lodash-es/groupBy";

let db: Database;

const dbObservable = new BehaviorSubject<DBEvent>({ type: DBEvents.NOP });

const init = async () => {
  db = await Database.load("file::memory:");

  await Promise.all([
    db.execute(
      create(Tables.TradeRoutes, [
        { name: "CityA", type: "INTEGER", references: "City" },
        { name: "CityB", type: "INTEGER", references: "City" },
        { name: "name", type: "TEXT" },
      ])
    ),
    db.execute(
      create(Tables.VehicleTypes, [
        { name: "name", type: "TEXT" },
        { name: "desc", type: "TEXT" },
        { name: "price", type: "REAL" },
        { name: "type", type: "TEXT" },
      ])
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "An elegant and fast flying machine. It is fast, but very fragile at the same time.",
          name: "Light helicopter",
          price: 500000,
          type: "air",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "A medium sized flying machine. It is relatively fast, but very fragile at the same time.",
          name: "Medium helicopter",
          price: 1500000,
          type: "air",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "A massive and strong flying machine. It is relatively fast, but very fragile at the same time.",
          name: "Heavy cargo helicopter",
          price: 4500000,
          type: "air",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "A light truck.",
          name: "Light truck",
          price: 5000,
          type: "wheeled",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "A heavyweight truck.",
          name: "Heavy truck",
          price: 10000,
          type: "wheeled",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "Light tracked hauler.",
          name: "Light tracked hauler",
          price: 10000,
          type: "tracked",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "Medium tracked hauler",
          name: "Medium tracked hauler",
          price: 10000,
          type: "tracked",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "Heavy tracked hauler",
          name: "Heavy tracked hauler",
          price: 10000,
          type: "tracked",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "Light tracked escort",
          name: "Medium tracked escort",
          price: 10000,
          type: "tracked",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "Medium tracked escort",
          name: "Medium tracked escort",
          price: 10000,
          type: "tracked",
        },
      })
    ),
    db.execute(
      insert({
        table: Tables.VehicleTypes,
        attributes: {
          desc: "Heavy tracked escort",
          name: "Heavy truck",
          price: 10000,
          type: "tracked",
        },
      })
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
  dbObservable.next({ type: DBEvents.initialized });
};

const addVehicle = async () => {
  /*const data = await db.execute(
    insert("Vehicle", {  })
  );

  dbObservable.next({ type: DBEvents.tradeRouteUpdate, data });*/
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
  return db.select(
    select({
      attributes: [[Tables.Convoy, ["name", "ID"]]],
      table: Tables.Convoy,
    })
  );
};

const getVehiclesOfConvoy = (ID: number | null) => {
  return db.select(
    select({
      attributes: [[Tables.Convoy, ["name", "ID"]]],
      table: Tables.Convoy,
      join: [
        {
          A: Tables.Vehicle,
          equation: { A: [Tables.Vehicle, "ID"], B: [Tables.Convoy, ""] },
        },
      ],
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
  const citiesData = await db.select<City[]>(getQuery("getCities"));

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

const getCity = async (ID: number): Promise<City> => {
  const [cityData, classes, warehouse] = await Promise.all([
    db.select<City[]>(getQuery("getCity"), [ID]),
    getPopulation(ID),
    getCityWarehouse(ID),
  ]);

  await Promise.all(
    classes.map(
      async (e) =>
        (e.dailyRequirement = await getCityDailyConsumption(ID, e.ID))
    )
  );

  console.log("city data", cityData);

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
    db.select<CityPopulationClass[]>(
      `
    select CPC.ID, CPC.populationClass
        from CityPopulationClass as CPC
        where CPC.city = ?
    `,
      [cityID]
    ),
    db.select<PopulationClass[]>(`
        select PC.name, PC.ID
            from PopulationClass as PC
    `),
  ]);

  return populationClasses.filter((value) =>
    cityPopulationClasses.every(({ ID }) => value.ID !== ID)
  );
};

const addCityClass = (cityID: number, cityClassID: number) => {
  return db.execute(
    `
        insert into CityPopulationClass (num, populationClass, city) values (0, $1, $2)
    `,
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
    `
        select CDR.num as dailyRequirement, CPC.num, CDR.item, I.nameKey, PC.name, CDR.ID as dailyRequirementID, I.descriptionKey
        from City as C
        inner join CityPopulationClass as CPC on C.ID = CPC.city
        inner join PopulationClass as PC on PC.ID = CPC.populationClass
        inner join ClassDailyRequirement as CDR on CDR.Class = PC.ID
        inner join Item as I on I.ID = CDR.item
        where C.ID = $1 AND PC.ID = $2
    `,
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
    `
        select num, PopulationClass.name, PopulationClass.ID
            from City inner join CityPopulationClass on City.ID = CityPopulationClass.city 
            inner join PopulationClass on CityPopulationClass.populationClass = PopulationClass.ID
            where City.ID = $1 
            group by PopulationClass.name
    `,
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
      `
        select I.nameKey, I.descriptionKey, CW.number, I.ID
        from City as C
        inner join CityWarehouse as CW on CW.city = C.ID
        inner join Item as I on I.ID = CW.item
        where C.ID = $1
    `,
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
            group by IBR.item
        `,
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
        where IBS.ID = $1
        `,
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
            where C.ID = ${ID}
        `,
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

const getCityIndustrialBuildings = async (ID: number) => {
  const industrialBuildings = await db.select<IndustrialBuilding[]>(
    `select IBS.ID, IBS.num as buildingNum, IB.nameKey
        from IndustrialBuilding as IB
        inner join IndustrialBuildings as IBS on IB.ID = IBS.industrialBuilding
        inner join City as C on C.ID = IBS.city
        where C.ID = $1
        `,
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
    `
    insert into IndustrialBuildings (num, industrialBuilding, city) values ($1, $2, $3)
    `,
    [num, industrialBuilding, city]
  );
};

const initialized = () => {
  return typeof db !== "undefined";
};

const setIndustrialBuildingNumber = (ID: number, num: number) => {
  return db.execute(
    `
        update IndustrialBuildings set num = $1 where ID = $2;
    `,
    [num, ID]
  );
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
};

export const GameStateContext = createContext(GameState);
