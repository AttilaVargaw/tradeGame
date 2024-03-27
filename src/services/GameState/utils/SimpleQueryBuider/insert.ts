import { TableData } from "@Services/GameState/tables/common";

import { ID } from "./common";
import { UpdateEvent, update } from "./update";

export type InsertAttribute<T extends object> = (keyof T & string)[];

export type InsertEvent<T extends object, TABLES extends string> = {
  table: string;
  attributes: Record<keyof T, string | ID | number | null | boolean>;
  onConflict?: UpdateEvent<T, TABLES>;
};

export function insert<
  T extends Record<keyof T, string | ID | number | null | boolean>,
  TABLES extends string
>({ table, attributes, onConflict }: InsertEvent<T, TABLES>) {
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
    .join(",")})${
    onConflict ? ` on conflict ${update(onConflict).replace(/;$/, "")}` : ""
  };`;
}

export function FillTable<
  T extends Record<keyof T, string | ID | number | null | boolean>,
  TABLES extends string
>({ name, initData }: TableData<T>) {
  if (initData) {
    return initData
      .map((attributes) => insert<T, TABLES>({ table: name, attributes }))
      .join("");
  }
  return "";
}
