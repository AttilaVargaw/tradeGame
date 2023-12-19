import {
  ID,
  insert,
  select,
  update,
} from "@Services/GameState/utils/SimpleQueryBuider";

import { DBEvents } from "../../dbTypes";
import { db, dbObservable } from "../../gameState";
import { CityPositionProperty } from "../common";
import { VehicleType } from "../vehicleTypes";
import { VehicleData } from "./Vehicle";

export const getVehicles = () => {
  return db.select<VehicleData[]>(
    select({
      attributes: [["Vehicle", ["ID", "name", "posY", "posX", "convoy"]]],
      table: "Vehicle",
    })
  );
};

export const getVehiclesOfConvoy = (ID: ID | null) => {
  return db.select<VehicleData[]>(
    select<VehicleData, "Vehicle" | "Convoy">({
      attributes: [["Vehicle", ["name", "ID", "inventory"]]],
      table: "Vehicle",
      join: [
        {
          A: "Convoy",
          equation: { A: ["Convoy", "ID"], B: ["Vehicle", "convoy"] },
        },
      ],
      where: [{ A: ["Vehicle", "convoy"], value: ID }],
    })
  );
};

const getVehicleGoalsAsGeoJsonQuery = select<VehicleData, "Vehicle">({
  attributes: [["Vehicle", ["posX", "posY", "ID", "goalY", "goalX"]]],
  table: "Vehicle",
  where: [
    { A: ["Vehicle", "convoy"], value: null, operator: " is " },
    { A: ["Vehicle", "goalX"], value: null, operator: " is not " },
    { A: ["Vehicle", "goalY"], value: null, operator: " is not " },
  ],
});

export const getVehicleGoalsAsGeoJson = async () => {
  const convoysData = await db.select<VehicleData[]>(
    getVehicleGoalsAsGeoJsonQuery
  );

  return {
    type: "FeatureCollection",
    features: convoysData.map(({ goalX, goalY, posX, posY }) => ({
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
    select<VehicleData, "Vehicle">({
      attributes: [["Vehicle", ["posX", "posY", "ID", "type", "name"]]],
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

export const getVehicleTypes = (type: string) => {
  return db.select<VehicleType[]>(
    select({
      table: "VehicleTypes",
      attributes: [["VehicleTypes", ["price", "ID", "desc", "name", "type"]]],
      where: [{ A: ["VehicleTypes", "type"], value: type }],
    })
  );
};

export const addVehicle = async (type: number, name: string) => {
  const data = await db.execute(
    insert({
      table: "Vehicle",
      attributes: { name, posX: 0, posY: 0, type },
    })
  );

  dbObservable.next({ type: DBEvents.newVehicleBought, data });
};

export const getVehicleType = (ID: ID) => {
  return db.select<VehicleType[]>(
    select<VehicleType, "VehicleTypes">({
      attributes: [
        ["VehicleTypes", ["name", "desc", "ID", "price", "inventorySize"]],
      ],
      table: "VehicleTypes",
      where: [{ A: ["VehicleTypes", "ID"], value: ID }],
    })
  );
};

export async function GetVehicleCount() {
  return (
    await db.select<{ count: number }[]>(
      select<{ ID: ID }, "Vehicle" | "", { count: number }>({
        table: "Vehicle",
        attributes: [["", ["count(ID) as count"]]],
      })
    )
  )[0]["count"];
}

const setVehicleGoalQuery = update<VehicleData, "Vehicle">({
  table: "Vehicle",
  where: [{ A: ["Vehicle", "ID"], value: "?" }],
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
    update<VehicleData, "Vehicle">({
      table: "Vehicle",
      where: [{ A: ["Vehicle", "ID"], value: VehicleID }],
      updateRows: [["convoy", convoyID]],
    })
  );

  dbObservable.next({ type: DBEvents.vehicleJoinedConvoy, data });
};
