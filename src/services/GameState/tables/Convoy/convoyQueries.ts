import { isUndefined } from "lodash-es";

import {
  insert,
  select,
  update,
} from "@Services/GameState/utils/simpleQueryBuilder";
import { Lenght } from "@Services/utils";

import { CityPositionProperty, DBEvents, ID } from "../../dbTypes";
import { db, dbObservable } from "../../gameState";
import { getQuery } from "../../queryManager";
import { getCities } from "../City/cityQueries";
import { VehicleData } from "../Vehicle/Vehicle";
import { Tables } from "../common";
import { ConvoyData } from "./Convoy";

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

const getConvoysQuery = select({
  attributes: [
    [
      Tables.Convoy,
      [
        "name",
        "ID",
        "route",
        "posY",
        "posX",
        "goalX",
        "goalY",
        "dockedTo",
        "isRouteActive",
      ],
    ],
  ],
  table: Tables.Convoy,
});

export const getConvoys = () => {
  return db.select<ConvoyData[]>(getConvoysQuery);
};

const getConvoyQuery = select({
  attributes: [
    [Tables.Convoy, ["name", "ID", "route", "posY", "posX", "isRouteActive"]],
  ],
  table: Tables.Convoy,
  where: [{ A: [Tables.Convoy, "ID"], value: "?" }],
});

export const getConvoy = async (id: ID | null) => {
  if (isUndefined(id)) {
    return;
  }

  return (await db.select<ConvoyData[]>(getConvoyQuery, [id]))[0];
};

export async function dockConvoyToCity(convoyID: ID, cityID: ID | null) {
  await db.execute(
    update({
      table: Tables.Convoy,
      where: [{ A: [Tables.Convoy, "ID"], value: convoyID, operator: "=" }],
      updateRows: [["dockedTo", cityID]],
    })
  );

  dbObservable.next({
    type: cityID ? DBEvents.convoyDock : DBEvents.convoyUnDock,
    data: cityID,
  });
}

const getConvoysAsGeoJsonQuery = select({
  attributes: [
    [Tables.Convoy, ["posX", "posY", "ID", "type", "name", "dockedTo"]],
  ],
  table: Tables.Convoy,
});

export const getConvoysAsGeoJson = async () => {
  const convoysData = await db.select<ConvoyData[]>(getConvoysAsGeoJsonQuery);

  return {
    type: "FeatureCollection",
    features: convoysData.map(({ posX, posY, name, ID, dockedTo }) => ({
      type: "Feature",
      geometry: {
        coordinates: [posX, posY],
        type: "Point",
      },
      properties: { name, type: "vehicle", ID, dockedTo },
    })),
  } as GeoJSON.FeatureCollection<GeoJSON.Point, ConvoyData>;
};

const getConvoyGoalsAsGeoJsonQuery = select({
  attributes: [[Tables.Convoy, ["posX", "posY", "ID", "goalX", "goalY"]]],
  table: Tables.Convoy,
  where: [
    { A: [Tables.Convoy, "goalX"], value: null, operator: " is not " },
    { A: [Tables.Convoy, "goalY"], value: null, operator: " is not " },
  ],
});

export const getConvoyGoalsAsGeoJson = async () => {
  const convoysData = await db.select<ConvoyData[]>(
    getConvoyGoalsAsGeoJsonQuery
  );

  return {
    type: "FeatureCollection",
    features: convoysData.map(({ goalX, goalY, posX, posY, ID }) => ({
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

const getConvoySpeedQuery = select({
  attributes: [
    ["", "min(VehicleTypes.speed) as minSpeed"],
    ["", "min(VehicleTypes.speed) * ? as dS"],
    ["", "Convoy.posX - Convoy.goalX as headingX"],
    ["", "Convoy.posY - Convoy.goalY as headingY"],
  ],
  table: Tables.Convoy,
  join: [
    {
      A: Tables.Vehicle,
      equation: {
        A: [Tables.Convoy, "ID"],
        B: [Tables.Vehicle, "convoy"],
      },
    },
    {
      A: Tables.VehicleTypes,
      equation: {
        A: [Tables.Vehicle, "type"],
        B: [Tables.VehicleTypes, "ID"],
      },
    },
  ],
  where: [{ A: [Tables.Convoy, "ID"], value: "?" }],
});

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
            getConvoySpeedQuery,
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

export const getConvoylessVehicles = () => {
  return db.select<VehicleData[]>(
    select({
      attributes: [[Tables.Vehicle, ["name", "ID"]]],
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "convoy"], value: null, operator: " is " }],
    })
  );
};

export const getConvoylessVehiclesAsGeoJSON = async () => {
  const vehicleData = await db.select<VehicleData[]>(
    select({
      attributes: [[Tables.Vehicle, ["name", "ID", "posX", "posY"]]],
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

const setConvoyTradeRouteQuery = update({
  table: Tables.Convoy,
  updateRows: [["route", "$1"]],
  where: [{ A: [Tables.Convoy, "ID"], value: "$2" }],
});

export const setConvoyTradeRoute = async (ID: ID, routeID: ID | null) => {
  const data = await db.execute(setConvoyTradeRouteQuery, [routeID, ID]);

  dbObservable.next({ type: DBEvents.convoyUpdated, data });
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

export async function getVehiclesOfConvoy(convoyID?: ID) {
  if (isUndefined(convoyID)) {
    return [];
  }

  return await db.select<VehicleData[]>(
    select({
      table: Tables.Vehicle,
      attributes: [[Tables.Vehicle, ["ID", "inventory", "name"]]],
      where: [{ A: [Tables.Vehicle, "ID"], value: convoyID }],
    })
  );
}

const setConvoyRouteActiveQuery = update({
  table: Tables.Convoy,
  updateRows: [["isRouteActive", "?"]],
  where: [{ A: [Tables.Convoy, "ID"], value: "?" }],
});

export async function setConvoyRouteActive(convoyID: ID, active: boolean) {
  await db.execute(setConvoyRouteActiveQuery, [active ? 1 : 0, convoyID]);

  dbObservable.next({ type: DBEvents.convoyUpdated });
}
