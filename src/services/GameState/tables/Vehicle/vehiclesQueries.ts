import { CityPositionProperty, DBEvents, VehicleType } from "../../dbTypes";
import { db, dbObservable } from "../../gameState";
import { insert, select, update } from "@Services/GameState/utils/simpleQueryBuilder";

import { ID } from "../../dbTypes";
import { Tables } from "../common";
import { VehicleData } from "./Vehicle";

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

export const addVehicle = async (type: number, name: string) => {
  const data = await db.execute(
    insert({
      table: Tables.Vehicle,
      attributes: { name, posX: 0, posY: 0, type },
    })
  );

  dbObservable.next({ type: DBEvents.newVehicleBought, data });
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

const setVehicleGoalQuery = update({
  table: Tables.Vehicle,
  where: [{ A: [Tables.Vehicle, "ID"], value: "?" }],
  updateRows: [
    ["goalX", "?"],
    ["goalY", "?"],
  ],
});

export const setVehicleGoal = async (ID: ID, goalX: number, goalY: number) => {
  const data = await db.execute(setVehicleGoalQuery, [goalX, goalY, ID]);

  dbObservable.next({ type: DBEvents.vehicleGoalSet, data });
};

export const addVehicleToConvoy = async (convoyID: ID, VehicleID: ID) => {
  const data = await db.execute(
    update({
      table: Tables.Vehicle,
      where: [{ A: [Tables.Vehicle, "ID"], value: VehicleID }],
      updateRows: [["convoy", convoyID]],
    })
  );

  dbObservable.next({ type: DBEvents.vehicleJoinedConvoy, data });
};
