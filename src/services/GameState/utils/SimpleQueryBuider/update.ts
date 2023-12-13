import { Tables } from "@Services/GameState/tables/common";

import { Join, joinEquitationToString } from "./JoinEquation";
import { WhereEquitation, whereEquationToString } from "./WhereEquation";
import { ID, InputToString } from "./common";

export type UpdateEvent<T extends object> = {
  updateRows: [keyof T & string, string | number | null | ID | boolean][];
  table: Tables;
  where?: WhereEquitation<Tables>[];
  join?: Join<Tables>[];
  toBind?: boolean;
};

//@TODO
export function update<T extends object>({
  table,
  updateRows,
  join,
  where,
  toBind = false,
}: UpdateEvent<T>) {
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
