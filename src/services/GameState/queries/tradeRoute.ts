import { DBEvents, ID, TradeRouteProps } from "../dbTypes";
import { db, dbObservable } from "../gameState";
import { insert, select } from "@Services/GameState/utils/simpleQueryBuilder";

import { Tables } from "../tables/common";
import { getCity } from "../tables/City/cityQueries";

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
