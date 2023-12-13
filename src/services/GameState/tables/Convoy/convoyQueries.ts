import { isUndefined } from "lodash-es";

import {
  ID,
  UpdateEvent,
  insert,
  select,
  update,
} from "@Services/GameState/utils/SimpleQueryBuider";
import { Lenght } from "@Services/utils";

import { DBEvents } from "../../dbTypes";
import { db, dbObservable } from "../../gameState";
import { getCities } from "../City/cityQueries";
import { VehicleData } from "../Vehicle/Vehicle";
import { CityPositionProperty } from "../common";
import { ConvoyData } from "./Convoy";

export async function CreateConvoy(name: string) {
  const data = await db.execute(
    insert({
      table: "Convoy",
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
      table: "Convoy",
      where: [{ A: ["Convoy", "ID"], value: convoyID }],
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
      select<{ "count(ID)": number }>({
        table: "Convoy",
        attributes: [["", "count(ID)"]],
      })
    )
  )[0]["count(ID)"];
}

const getConvoysQuery = select({
  attributes: [
    [
      "Convoy",
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
  table: "Convoy",
});

export const getConvoys = () => {
  return db.select<ConvoyData[]>(getConvoysQuery);
};

const getConvoyQuery = select({
  attributes: [
    ["Convoy", ["name", "ID", "route", "posY", "posX", "isRouteActive"]],
  ],
  table: "Convoy",
  where: [{ A: ["Convoy", "ID"], value: "?" }],
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
      table: "Convoy",
      where: [{ A: ["Convoy", "ID"], value: convoyID, operator: "=" }],
      updateRows: [["dockedTo", cityID]],
    })
  );

  dbObservable.next({
    type: cityID ? DBEvents.convoyDock : DBEvents.convoyUnDock,
    data: cityID,
  });
}

const getConvoysAsGeoJsonQuery = select({
  attributes: [["Convoy", ["posX", "posY", "ID", "type", "name", "dockedTo"]]],
  table: "Convoy",
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
  attributes: [["Convoy", ["posX", "posY", "ID", "goalX", "goalY"]]],
  table: "Convoy",
  where: [
    { A: ["Convoy", "goalX"], value: null, operator: " is not " },
    { A: ["Convoy", "goalY"], value: null, operator: " is not " },
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

const getConvoySpeedQuery = select<{
  minSpeed: number;
  dS: number;
  headingX: number;
  headingY: number;
  "min(VehicleTypes.speed) as minSpeed": string;
}>({
  attributes: [
    ["", "min(VehicleTypes.speed) as minSpeed"],
    ["", "min(VehicleTypes.speed) * ? as dS"],
    ["", "Convoy.posX - Convoy.goalX as headingX"],
    ["", "Convoy.posY - Convoy.goalY as headingY"],
  ],
  table: "Convoy",
  join: [
    {
      A: "Vehicle",
      equation: {
        A: ["Convoy", "ID"],
        B: ["Vehicle", "convoy"],
      },
    },
    {
      A: "VehicleTypes",
      equation: {
        A: ["Vehicle", "type"],
        B: ["VehicleTypes", "ID"],
      },
    },
  ],
  where: [{ A: ["Convoy", "ID"], value: "?" }],
});

const getConvoyQuery2 = select({
  attributes: [
    ["Convoy", ["name", "ID", "goalX", "goalY", "posY", "posX", "dockedTo"]],
    ["", "posX-goalX as goalVectorX"],
    ["", "posY-goalY as goalVectorY"],
  ],
  table: "Convoy",
});

export async function UpdateConvoys(dt: number) {
  const convoys = await db.select<ConvoyData[]>(getConvoyQuery2);

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

          const updateRows: UpdateEvent<VehicleData>["updateRows"] = [
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
            update<VehicleData>({
              table: "Convoy",
              where: [{ A: ["Convoy", "ID"], value: "?" }],
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
      attributes: [["Vehicle", ["name", "ID"]]],
      table: "Vehicle",
      where: [{ A: ["Vehicle", "convoy"], value: null, operator: " is " }],
    })
  );
};

export const getConvoylessVehiclesAsGeoJSON = async () => {
  const vehicleData = await db.select<VehicleData[]>(
    select({
      attributes: [["Vehicle", ["name", "ID", "posX", "posY"]]],
      table: "Vehicle",
      where: [{ A: ["Vehicle", "convoy"], value: null, operator: " is " }],
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
        table: "TradeRoutes",
        attributes: [["", "count(ID)"]],
      })
    )
  )[0]["count(ID)"];
}

const setConvoyTradeRouteQuery = update({
  table: "Convoy",
  updateRows: [["route", "$1"]],
  where: [{ A: ["Convoy", "ID"], value: "$2" }],
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
      table: "Vehicle",
      attributes: [["Vehicle", ["ID", "inventory", "name"]]],
      where: [{ A: ["Vehicle", "ID"], value: convoyID }],
    })
  );
}

const setConvoyRouteActiveQuery = update({
  table: "Convoy",
  updateRows: [["isRouteActive", "?"]],
  where: [{ A: ["Convoy", "ID"], value: "?" }],
});

export async function setConvoyRouteActive(convoyID: ID, active: boolean) {
  await db.execute(setConvoyRouteActiveQuery, [active ? 1 : 0, convoyID]);

  dbObservable.next({ type: DBEvents.convoyUpdated });
}
