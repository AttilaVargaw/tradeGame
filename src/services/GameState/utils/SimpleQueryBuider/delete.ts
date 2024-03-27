import { Join, joinEquitationToString } from "./JoinEquation";
import { WhereEquitation, whereEquationToString } from "./WhereEquation";

export type DeleteEvent<T extends object, TABLES extends string> = {
  table: TABLES;
  where?: WhereEquitation<TABLES, T>[];
  join?: Omit<Join<TABLES>, "as">[];
};

export function Delete<T extends object, TABLES extends string>({
  table,
  join,
  where,
}: DeleteEvent<T, TABLES>) {
  return `delete from ${table} ${
    join?.map(
      ({ equation, type, A }) =>
        `${type ?? " inner"} join ${A} ${joinEquitationToString(equation)}`
    ) ?? ""
  }${
    (where?.length || 0) > 0
      ? ` WHERE ${where?.map(whereEquationToString).join(" and ")}`
      : ""
  }`;
}
