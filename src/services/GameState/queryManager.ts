import { select } from "../simpleQueryBuilder";
import { Tables } from "./tables/common";

export type QueryTypes =
  | "getCities"
  | "getCity"
  | "getConvoys"
  | "updateConvoy"
  | "getConvoySpeed";

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
                ["City", ["ID", "name", "posX", "posY"]],
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
            attributes: [[Tables.City, ["ID", "name", "posX", "posY", "type"]]],
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
                ["name", "ID", "goalX", "goalY", "posY", "posX"],
              ],
              ["", "posX-goalX as goalVectorX"],
              ["", "posY-goalY as goalVectorY"],
            ],
            table: Tables.Convoy,
          })
        );
        break;
      }
      case "getConvoySpeed":
        queries.set(
          type,
          select({
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
          })
        );
    }
  }

  return queries.get(type) || "";
}
