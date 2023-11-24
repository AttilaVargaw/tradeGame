import { CityPositionProperty, DBEvents, ID } from "../../dbTypes";
import { db, dbObservable } from "../../gameState";
import { insert, select, update } from "@Services/GameState/utils/simpleQueryBuilder";

import { ConvoyData } from "./Convoy";
import { Lenght } from "@Services/utils";
import { Tables } from "../common";
import { VehicleData } from "../Vehicle/Vehicle";
import { getCities } from "../City/cityQueries";
import { getQuery } from "../../queryManager";

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
      ["name", "ID", "route", "posY", "posX", "goalX", "goalY", "dockedTo"],
    ],
  ],
  table: Tables.Convoy,
});

export const getConvoys = () => {
  return db.select<ConvoyData[]>(getConvoysQuery);
};

const getConvoyQuery = select({
  attributes: [[Tables.Convoy, ["name", "ID", "route", "posY", "posX"]]],
  table: Tables.Convoy,
  where: [{ A: [Tables.Convoy, "ID"], value: "?" }],
});

export const getConvoy = async (ID: ID) => {
  return (await db.select<ConvoyData[]>(getConvoyQuery, [ID]))[0];
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
  });
}

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

export const setConvoyTradeRoute = async (ID: ID, routeID: ID | null) => {
  const data = await db.execute(
    update({
      table: Tables.Convoy,
      updateRows: [["route", routeID]],
      where: [{ A: [Tables.Convoy, "ID"], value: ID }],
    })
  );

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