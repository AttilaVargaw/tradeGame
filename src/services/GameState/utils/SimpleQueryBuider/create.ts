import { DBAttr, attrToCreateQuery } from "./common";

export function create<T extends string>(
  tableName: T,
  attr: (DBAttr | string)[],
  drop = true
) {
  attr.forEach((a) => {
    if (typeof a !== "string" && a.references && !a.referencesOn) {
      a.referencesOn = `ID`;
    }
  });

  return `${
    drop ? `drop table if exists ${tableName};` : ""
  }CREATE TABLE ${tableName} (ID INTEGER PRIMARY KEY AUTOINCREMENT, ${attr
    .map(attrToCreateQuery)
    .join(",")});`;
}
