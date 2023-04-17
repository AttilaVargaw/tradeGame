import {
  CityAttr,
  ConvoyAttr,
  Tables,
  TradeRouteAttr,
  TradeRouteInsertData,
  VehicleAttr,
  VehicleInsertData,
  VehicleTypeAttr,
  VehicleTypeInsertData,
} from "./GameState/dbTypes";

export type dbTypes = "REAL" | "INTEGER" | "TEXT";

type Attr = {
  name: string;
  type: dbTypes;
  references?: string;
  referencesOn?: string;
  notNullable?: boolean | null;
};

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

export function create(tableName: Tables, attr: Attr[], drop = true) {
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

type JoinEquitation = {
  A: [Tables | string, string];
  B: [Tables | string, string];
  operator?: "=" | ">" | "<" | "<>";
};

type WhereEquitation = {
  A: [Tables, string];
  operator?: "=" | ">" | "<" | "<>";
  value: string | number | null;
};

function whereEquationToString({
  operator = "=",
  A: [table, attr],
  value = null,
}: WhereEquitation) {
  const addQuotations = typeof value && attr !== "ID";

  return `${table}.${attr}${operator}${
    value
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

export type SelectAttribute<ATTRIBUTES> = ([ATTRIBUTES, string] | ATTRIBUTES)[];

export type SelectEvent = {
  table: Tables;
  attributes: [
    Tables | string,
    (
      | SelectAttribute<VehicleAttr>
      | SelectAttribute<VehicleTypeAttr>
      | SelectAttribute<ConvoyAttr>
      | SelectAttribute<CityAttr>
      | SelectAttribute<TradeRouteAttr>
    )
  ][];
  where?: WhereEquitation[];
  join?: Join[];
};

export function select({ attributes, join, where, table }: SelectEvent) {
  return `SELECT ${attributes
    .map(([tableName, attrs]) => {
      return attrs.map((attr) =>
        typeof attr === "string"
          ? `${tableName}.${attr}`
          : `${tableName ? `${tableName}.` : ""}${attr[0]}${
              attr[1] ? ` as ${attr[1]}` : ""
            }`
      );
    })
    .join(",")} from ${table}${
    join?.length || 0 > 0
      ? join?.map(
          ({ A, equation, as }) =>
            ` inner join ${A} ${as ? ` ${as}` : ""} on ${joinEquitationToString(
              equation
            )}`
        )
      : ""
  }${
    (where?.length || 0) > 0
      ? ` WHERE ${where?.map(whereEquationToString).join(",")}`
      : ""
  };`;
}

export type Join = {
  A: Tables;
  equation: JoinEquitation;
  as?: string;
};

//@TODO
export function update(
  updateRows: string[],
  table: Tables,
  where?: WhereEquitation[],
  join?: Join[]
) {
  return `UPDATE ${table}${
    join
      ? join
          .map(
            ({ A, equation }) =>
              ` inner join ${joinEquitationToString(equation)}`
          )
          .join(",")
      : ""
  }${
    where?.length || 0 > 0
      ? ` WHERE ${where?.map(whereEquationToString).join(",")}`
      : ""
  };`;
}

/*export function insert<Attr1 extends string | number | symbol>(
  table: Tables,
  rows: { [property in Attr1]: string | number | null }
) {
  return `insert into ${table} (${Object.keys(rows).join(
    ","
  )}) values (${Object.values(rows)
    .filter((e) => e !== undefined)
    .map(
      (e) =>
        `${typeof e === "string" ? '"' : ""}${e}${
          typeof e === "string" ? '"' : ""
        }`
    )
    .join(",")})`;
}*/

export type VehicleInsertEvent = {
  table: Tables.Vehicle;
  attributes: VehicleInsertData;
};

export type TradeRouteInsertEvent = {
  table: Tables.TradeRoutes;
  attributes: TradeRouteInsertData;
};

export type VehicleTypeInsertEvent = {
  table: Tables.VehicleTypes;
  attributes: VehicleTypeInsertData;
};

export type InsertEvent =
  | VehicleInsertEvent
  | TradeRouteInsertEvent
  | VehicleTypeInsertEvent;

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
    .join(",")})`;
}
