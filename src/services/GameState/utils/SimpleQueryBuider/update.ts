import { Join, joinEquitationToString } from "./JoinEquation";
import { WhereEquitation, whereEquationToString } from "./WhereEquation";
import { ID, InputToString } from "./common";

export type UpdateEvent<T extends object, TABLES extends string> = {
  updateRows: [keyof T & string, string | number | null | ID | boolean][];
  table: TABLES;
  where?: WhereEquitation<TABLES>[];
  join?: Join<TABLES>[];
  toBind?: boolean;
};

//@TODO
export function update<T extends object, TABLES extends string>({
  table,
  updateRows,
  join,
  where,
  toBind = false,
}: UpdateEvent<T, TABLES>) {
  return `UPDATE ${table}${
    join
      ? join.map(
          ({ A, equation }) => ` inner join ${joinEquitationToString(equation)}`
        )
      : //.join(",")
        ""
  }
    SET ${updateRows
      .map(([attr, value]) => `${attr}=${InputToString(value)}`)
      .join(",")}
    ${
      where?.length || 0 > 0
        ? ` WHERE ${where?.map(whereEquationToString).join(",")}`
        : ""
    };`;
}
