import { groupBy } from "lodash-es";

import { select } from "@Services/GameState/utils/simpleQueryBuilder";

import {
  CityPositionProperty,
  DailyRequirement,
  ID,
  IndustrialBuilding,
  PopulationClass,
  PopulationData,
} from "../../dbTypes";
import { db } from "../../gameState";
import { getEntityInventory } from "../../queries/inventory";
import { getQuery } from "../../queryManager";
import { CityPopulationClassData } from "../CityPopulationClass";
import { ConvoyData } from "../Convoy/Convoy";
import { ResourceChange, Tables } from "../common";
import { CityEntity, IndustryData } from "./CityTable";

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
    getEntityInventory(cityData.inventory),
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

const setPopulationQuery =
  "update CityPopulationClass set num = $1 where ID = $2;";

export const setPopulation = (ID: ID, num: number) => {
  return db.execute(setPopulationQuery, [num, ID]);
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

export const setIndustrialBuildingNumber = (ID: ID, num: number) => {
  return db.execute(`update IndustrialBuildings set num = $1 where ID = $2;`, [
    num,
    ID,
  ]);
};