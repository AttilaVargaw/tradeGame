import { isUndefined } from "lodash-es";

import { DBEvents } from "../dbTypes";
import { db, dbObservable } from "../gameState";
import { CityData } from "../tables/City/CityTable";
import { getCity } from "../tables/City/cityQueries";
import { REAL, TEXT } from "../tables/common";
import { ID, insert, select } from "../utils/SimpleQueryBuider";

export type TradeRouteProps = {
  cities: number[];
  name: string;
  ID: ID;
};

export type TradeRoute = {
  cityID: ID[];
  start: number[];
  end: number[];
  inBetween: number[][];
  name: string;
};

export type TradeRouteView = {
  name: string;
  ID: ID;
  cityAID: ID;
  cityBID: ID;
  cityAName: string;
  cityBName: string;
  cityAPosY: number;
  cityAPosX: number;
  cityBPosY: number;
  cityBPosX: number;
};

const getTradouteByIDQuery = select<
  TradeRoute & CityData,
  "TradeRoutes" | "CityA" | "CityB" | "City",
  TradeRouteView
>({
  table: "TradeRoutes",
  where: [{ A: ["TradeRoutes", "ID"], value: "?" }],
  attributes: [
    [
      "CityA",
      [
        "ID as cityAID",
        "name as cityAName",
        "posX as cityAPosX",
        "posY as cityAPosY",
      ],
    ],
    [
      "CityB",
      [
        "ID as cityBID",
        "name as cityBName",
        "posX as cityBPosX",
        "posY as cityBPosY",
      ],
    ],
    ["TradeRoutes", ["name", "ID"]],
  ],
  join: [
    {
      A: "City",
      equation: {
        A: ["CityA", "ID"],
        B: ["TradeRoutes", "cityA"],
        operator: "=",
      },
      as: "CityA",
    },
    {
      A: "City",
      equation: {
        A: ["CityB", "ID"],
        B: ["TradeRoutes", "cityB"],
        operator: "=",
      },
      as: "CityB",
    },
  ],
});

const getTradouteQuery = select({
  table: "TradeRoutes",
  attributes: [
    [
      "CityA",
      [
        "ID as cityAID",
        "name as cityAName",
        "posX as cityAPosX",
        "posY as cityAPosY",
      ],
    ],
    [
      "CityB",
      [
        "ID as cityBID",
        "name as cityBName",
        "posX as cityBPosX",
        "posY as cityBPosY",
      ],
    ],
    ["TradeRoutes", ["name", "ID"]],
  ],
  join: [
    {
      A: "City",
      equation: {
        A: ["CityA", "ID"],
        B: ["TradeRoutes", "cityA"],
        operator: "=",
      },
      as: "CityA",
    },
    {
      A: "City",
      equation: {
        A: ["CityB", "ID"],
        B: ["TradeRoutes", "cityB"],
        operator: "=",
      },
      as: "CityB",
    },
  ],
});

export const getAllTradeRoute = () => {
  return db.select<TradeRouteAsGeoJSONView[]>(getTradouteQuery);
};

export const getTradeRouteByID = async (id?: number | null) => {
  if (isUndefined(id)) {
    return null;
  }

  return (
    await db.select<TradeRouteAsGeoJSONView[]>(getTradouteByIDQuery, [id])
  )[0];
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
    select<
      { ID: ID; name: TEXT; posX: REAL; posY: REAL },
      "CityA" | "CityB" | "TradeRoutes" | "City",
      {
        cityAID: ID;
        cityBID: ID;
        cityAName: TEXT;
        cityAPosX: REAL;
        cityAPosY: REAL;
        name: TEXT;
        ID: ID;
        cityBName: TEXT;
        cityBPosX: TEXT;
        cityBPosY: TEXT;
      }
    >({
      table: "TradeRoutes",
      where: ID ? [{ A: ["TradeRoutes", "ID"], value: ID }] : undefined,
      attributes: [
        [
          "CityA",
          [
            "ID as cityAID",
            "name as cityAName",
            "posX as cityAPosX",
            "posY as cityAPosY",
          ],
        ],
        [
          "CityB",
          [
            "ID as cityBID",
            "name as cityBName",
            "posX as cityBPosX",
            "posY as cityBPosY",
          ],
        ],
        ["TradeRoutes", ["name", "ID"]],
      ],
      join: [
        {
          A: "City",
          equation: {
            A: ["CityA", "ID"],
            B: ["TradeRoutes", "cityA"],
            operator: "=",
          },
          as: "CityA",
        },
        {
          A: "City",
          equation: {
            A: ["CityB", "ID"],
            B: ["TradeRoutes", "cityB"],
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

export const addTradeRoute = async ([cityA, cityB]: (ID | null)[]) => {
  if (cityA && cityB) {
    const [start, end] = await Promise.all([cityA, cityB].map(getCity));

    const data = await db.execute(
      insert<{ cityA: ID; cityB: ID; name: string }, "TradeRoutes">({
        table: "TradeRoutes",
        attributes: {
          cityA,
          cityB,
          name: `${start?.name}, ${end?.name} route`,
        },
      })
    );

    dbObservable.next({ type: DBEvents.tradeRouteAdded, data });
  }
};
