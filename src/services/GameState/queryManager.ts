import { select } from "../simpleQueryBuilder";
import { Tables } from "./dbTypes";

export type QueryTypes = "getCities" | "getCity";

const queries = new Map<QueryTypes, string>();

export function getQuery(type: "getCities" | "getCity"): string {
  if (!queries.has(type)) {
    switch (type) {
      case "getCities":
        {
          queries.set(
            type,
            select({
              attributes: [
                [Tables.City, ["ID", "name", "posX", "posY"]],
                [Tables.CityTypes, [["name", "type"]]],
              ],
              table: Tables.City,
              join: [
                {
                  A: Tables.CityTypes,
                  equation: {
                    A: ["City", "type"],
                    B: ["CityTypes", "ID"],
                  },
                },
              ],
            })
          );
        }
        break;
      case "getCity": {
        queries.set(
          type,
          select({
            attributes: [[Tables.City, ["ID", "name", "posX", "posY", "type"]]],
            table: Tables.City,
            where: [{ A: [Tables.City, "ID"], operator: "=", value: "?" }],
          })
        );
        break;
      }
    }
  }

  return queries.get(type) || "";
}
