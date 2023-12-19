import { Join, joinEquitationToString } from "./JoinEquation";
import { WhereEquitation, whereEquationToString } from "./WhereEquation";

export type SelectAttribute<
  ATTRIBUTES extends string,
  ATTRIBUTES2 extends string
> = ATTRIBUTES | `${ATTRIBUTES2} as ${ATTRIBUTES}`;

type Operation = "*" | "-" | "+" | "/";

type AggregationFunctions = "count" | "min";

export type Aggregation<
  A extends string,
  AS extends string = A,
  TABLES extends string = ""
> =
  | `${AggregationFunctions}(${A}) as ${AS}` // count(a) as AS
  | `${AggregationFunctions}(${A}) ${Operation} ? as ${AS}` // count(a) + ? as AS
  | `${AggregationFunctions}(${TABLES}.${A}) ${Operation} ? as ${AS}` // count(a) + ? as AS
  | `${TABLES}.${A} ${Operation} ${TABLES}.${A} as ${AS}` // count(a) + count(b) as AS
  | `${AggregationFunctions}(${A}) as ${AS}` // count(a) + count(b) as AS
  | `${AggregationFunctions}(${TABLES}.${A}) as ${AS}` // count(a) + count(b) as AS
  | `${A} ${Operation} ${A} as ${AS}`; // a + b as AS

export type SelectEvent<
  RESULT extends object,
  TABLES extends string,
  SELECT extends object = RESULT
> = {
  table: TABLES;
  attributes: [
    TABLES,
    (
      | SelectAttribute<keyof RESULT & string, keyof SELECT & string>
      | Aggregation<keyof SELECT & string, keyof RESULT & string, TABLES>
    )[]
  ][];
  where?: WhereEquitation<TABLES>[];
  join?: Join<TABLES>[];
  groupBy?: string;
};

export function select<
  RESULT extends object,
  TABlES extends string,
  SELECT extends object = RESULT
>({
  attributes,
  join,
  where,
  table,
  groupBy,
}: SelectEvent<SELECT, TABlES, RESULT>) {
  return `SELECT ${attributes
    .map(([tableName, attrs]) => {
      if (typeof attrs === "string") {
        return attrs;
      } else {
        return attrs.map(
          (attr) => `${tableName.length === 0 ? "" : `${tableName}.`}${attr}`
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
