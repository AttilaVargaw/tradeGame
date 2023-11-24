import {
  CityAttr,
  ConvoyAttr,
  TableData,
  Tables,
  TradeRouteAttr,
  VehicleAttr,
} from "../tables/common";
import {
  ConvoyInsertData,
  ID,
  TradeRouteInsertData,
  VehicleInsertData,
} from "../dbTypes";
import { VehicleTypeAttr, VehicleTypeData } from "../tables/vehicleTypes";

import { CityData } from "../tables/City/CityTable";
import { JoinEquitation } from "./JoinEquation";
import { WhereEquitation } from "./WhereEquation";

export type dbTypes = "REAL" | "INTEGER" | "TEXT";

export type SelectAttribute<ATTRIBUTES> = (
  | [ATTRIBUTES, string, string]
  | [ATTRIBUTES, string]
  | ATTRIBUTES
  | string
)[];

export type SelectEvent = {
  table: Tables;
  attributes: [
    Tables | string,
    (
      | (
          | SelectAttribute<VehicleAttr>
          | SelectAttribute<VehicleTypeAttr>
          | SelectAttribute<ConvoyAttr>
          | SelectAttribute<CityAttr>
          | SelectAttribute<TradeRouteAttr>
        )
      | string
    )
  ][];
  where?: WhereEquitation[];
  join?: Join[];
};

type Attr = {
  name: string;
  type: dbTypes;
  references?: string;
  referencesOn?: string;
  notNullable?: boolean | null;
};

export function DropTableIfExist(tableName: string) {
  return `drop table if exists ${tableName};`;
}

export function FillTable<T>({ name, initData }: TableData<T>) {
  if (initData) {
    return initData
      .map((attributes) => insert({ table: name, attributes } as InsertEvent))
      .join("");
  }
  return "";
}

function InputToString(input: string | number | null) {
  switch (typeof input) {
    case "string":
      return /(\+|-).*/.test(input) ? input : `"${input}"`;
    case "number":
      return `${input}`;
    case "undefined":
      return `NULL`;
    case "object":
      return `NULL`;
  }
}

function attrToCreateQuery({
  name,
  type,
  references,
  referencesOn,
  notNullable = false,
}: Attr) {
  return `${name} ${type} ${
    references ? ` REFERENCES ${references} (${referencesOn})` : ""
  }`;
}

export function create<TABLE = string>(
  tableName: TABLE,
  attr: Attr[],
  drop = true
) {
  attr.forEach((a) => {
    if (a.references && !a.referencesOn) {
      a.referencesOn = `ID`;
    }
  });

  return `${
    drop ? `drop table if exists ${tableName};` : ""
  }CREATE TABLE ${tableName} (ID INTEGER PRIMARY KEY AUTOINCREMENT, ${attr
    .map(attrToCreateQuery)
    .join(",")});`;
}
//bug with 0
function whereEquationToString({
  operator = "=",
  A: [table, attr],
  value = null,
}: WhereEquitation) {
  const addQuotations = typeof value && attr !== "ID";

  return `${table}.${attr}${operator}${
    value !== null
      ? `${addQuotations ? '"' : ""}${value}${addQuotations ? '"' : ""} `
      : "NULL"
  }`;
}

function joinEquitationToString({
  operator = "=",
  A: [A, AAttr],
  B: [B, BAttr],
}: JoinEquitation) {
  return `${A}.${AAttr}${operator}${B}.${BAttr}`;
}

export function select({ attributes, join, where, table }: SelectEvent) {
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
      ? ` WHERE ${where?.map(whereEquationToString).join(",")}`
      : ""
  };`;
}

export type Join<TABLE = string> = {
  A: TABLE;
  equation: JoinEquitation<TABLE>;
  as?: string;
};

//@TODO
export function update({
  table,
  updateRows,
  join,
  where,
  toBind = false,
}: {
  updateRows: [string, string | number | null | ID][];
  table: Tables;
  where?: WhereEquitation[];
  join?: Join[];
  toBind?: boolean;
}) {
  return `UPDATE ${table}${
    join
      ? join.map(
          ({ A, equation }) => ` inner join ${joinEquitationToString(equation)}`
        )
      : //.join(",")
        ""
  }
  SET ${updateRows
    .map(([attr, value]) => `${attr} = ${InputToString(value)}`)
    .join(",")}
  ${
    where?.length || 0 > 0
      ? ` WHERE ${where?.map(whereEquationToString).join(",")}`
      : ""
  };`;
}

export type VehicleInsertEvent = {
  table: "Vehicle";
  attributes: VehicleInsertData;
};

export type TradeRouteInsertEvent = {
  table: "TradeRoutes";
  attributes: TradeRouteInsertData;
};

export type VehicleTypeInsertEvent = {
  table: "VehicleTypes";
  attributes: VehicleTypeData;
};

export type ConvoyInsertEvent = {
  table: "Convoy";
  attributes: ConvoyInsertData;
};

export type CityInsertEvent = {
  table: "City";
  attributes: CityData;
};

export type InsertEvent =
  | VehicleInsertEvent
  | TradeRouteInsertEvent
  | VehicleTypeInsertEvent
  | CityInsertEvent
  | ConvoyInsertEvent;

export function insert({ table, attributes }: InsertEvent) {
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
