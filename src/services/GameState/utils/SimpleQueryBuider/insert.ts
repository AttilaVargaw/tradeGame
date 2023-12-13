import { TableData } from "@Services/GameState/tables/common";

import { ID } from "./common";

export type InsertAttribute<T extends object> = (keyof T & string)[];

export type InsertEvent<T extends object> = {
  table: string;
  attributes: Record<keyof T, string | ID | number | null | boolean>;
};

export function insert<
  T extends Record<keyof T, string | ID | number | null | boolean>
>({ table, attributes }: InsertEvent<T>) {
  return `insert into ${table} (${Object.keys(attributes).join(
    ","
  )}) values (${Object.values(attributes)
    .filter((e) => e !== undefined)
    .map(
      (e) =>
        `${typeof e === "string" ? '"' : ""}${e}${
          typeof e === "string" ? '"' : ""
        }`
    )
    .join(",")});`;
}

export function FillTable<
  T extends Record<keyof T, string | ID | number | null | boolean>
>({ name, initData }: TableData<T>) {
  if (initData) {
    return initData
      .map((attributes) => insert<T>({ table: name, attributes }))
      .join("");
  }
  return "";
}
