import { select } from "../simpleQueryBuilder";
import { CityAttr, CityTypes } from "./dbTypes";

export type QueryTypes = "getCities" | "getCity";

const queries = new Map<QueryTypes, string>();

export function getQuery(type: "getCities" | "getCity"): string {
  if (!queries.has(type)) {
    switch (type) {
      case "getCities":
        {
          queries.set(
            type,
            select<CityAttr, CityTypes>(
              [
                "City.ID",
                { row: "name", table: "City" },
                "posX",
                "posY",
                { row: "name", table: "CityTypes", as: "type" },
              ],
              "City",
              [],
              [
                {
                  A: "CityTypes",
                  equation: {
                    A: "City",
                    AAttr: "type",
                    B: "CityTypes",
                    BAttr: "ID",
                  },
                },
              ]
            )
          );
        }
        break;
      case "getCity": {
        queries.set(
          type,
          select<CityAttr, CityAttr>(
            ["ID", "name", "posX", "posY", "type"],
            "City",
            [{ A: "City", AAttr: "ID", operator: "=", value: "?" }]
          )
        );
        break;
      }
    }
  }

  return queries.get(type) || "";
}
