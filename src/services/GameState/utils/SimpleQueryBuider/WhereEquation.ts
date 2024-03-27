export type WhereEquitation<T extends string, E extends object = object> = {
  A: [T, keyof E];
  operator?: "=" | ">" | "<" | "<>" | " is " | " is not ";
  value: string | number | null;
};

//bug with 0
export function whereEquationToString<T extends string>({
  operator = "=",
  A: [table, attr],
  value = null,
}: WhereEquitation<T>) {
  const addQuotations = typeof value === "string" && attr !== "ID";

  return `${table}.${attr}${operator}${
    value !== null
      ? `${addQuotations ? '"' : ""}${value}${addQuotations ? '"' : ""} `
      : "NULL"
  }`;
}
