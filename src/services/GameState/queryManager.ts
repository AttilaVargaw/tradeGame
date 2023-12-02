import { Tables } from "./tables/common";
import { select } from "./utils/simpleQueryBuilder";

export type QueryTypes = "getCities" | "getCity" | "getConvoys";

const queries = new Map<QueryTypes, string>();

export function getQuery(type: QueryTypes): string {
  if (!queries.has(type)) {
    switch (type) {
      case "getCities":
        {
          queries.set(
            type,
            select({
              attributes: [
                ["City", ["ID", "name", "posX", "posY", "inventory"]],
                ["CityTypes", [["name", "type"]]],
              ],
              table: Tables.City,
              join: [
                {
                  A: "CityTypes",
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
            attributes: [
              [
                Tables.City,
                ["ID", "name", "posX", "posY", "type", "inventory"],
              ],
            ],
            table: Tables.City,
            where: [{ A: [Tables.City, "ID"], operator: "=", value: "?" }],
          })
        );
        break;
      }
      case "getConvoys": {
        queries.set(
          type,
          select({
            attributes: [
              [
                Tables.Convoy,
                ["name", "ID", "goalX", "goalY", "posY", "posX", "dockedTo"],
              ],
              ["", "posX-goalX as goalVectorX"],
              ["", "posY-goalY as goalVectorY"],
            ],
            table: Tables.Convoy,
          })
        );
        break;
      }
    }
  }

  return queries.get(type) || "";
}
