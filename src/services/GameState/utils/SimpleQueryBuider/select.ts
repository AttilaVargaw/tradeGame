import { Tables } from "@Services/GameState/tables/common";

import { Join, joinEquitationToString } from "./JoinEquation";
import { WhereEquitation, whereEquationToString } from "./WhereEquation";

export type SelectAttribute<ATTRIBUTES> = (
  | [ATTRIBUTES, string, string]
  | [ATTRIBUTES, string]
  | ATTRIBUTES
  | string
)[];

export type SelectEvent<T extends object, TABLES extends string = Tables> = {
  table: TABLES;
  attributes: [
    TABLES,
    (
      | SelectAttribute<keyof T & string>
      | [SelectAttribute<keyof T & string>, string][]
      | string
    )
  ][];
  where?: WhereEquitation<TABLES>[];
  join?: Join<TABLES>[];
  groupBy?: string;
};

export function select<T extends object, TABlES extends string = Tables>({
  attributes,
  join,
  where,
  table,
  groupBy,
}: SelectEvent<T, TABlES>) {
  return `SELECT ${attributes
    .map(([tableName, attrs]) => {
      if (typeof attrs === "string") {
        return attrs;
      } else {
        return attrs.map((attr) =>
          typeof attr === "string"
            ? `${tableName}.${attr}`
            : `${tableName !== "" ? `${tableName}.` : ""}${attr[0]}${
                attr[1] ? ` as ${attr[1]}` : ""
              }`
        );
      }
    })
    .join(",")} from ${table}${
    join?.length || 0 > 0
      ? join
          ?.map(
            ({ A, equation, as }) =>
              ` inner join ${A} ${
                as ? ` ${as}` : ""
              } on ${joinEquitationToString(equation)}`
          )
          .join(" ")
      : ""
  }${
    (where?.length || 0) > 0
      ? ` WHERE ${where?.map(whereEquationToString).join(" and ")}`
      : ""
  }${groupBy ? ` group by${groupBy}` : ""};`;
}
