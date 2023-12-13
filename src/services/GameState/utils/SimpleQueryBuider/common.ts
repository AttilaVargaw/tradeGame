export type ID = number;

export type dbTypes = "REAL" | "INTEGER" | "TEXT";

export function InputToString(input: string | number | null | boolean) {
  switch (typeof input) {
    case "string":
      return /(\+|-|\$\d*|\?).*/.test(input) ? input : `"${input}"`;
    case "number":
      return `${input}`;
    case "undefined":
      return `NULL`;
    case "object":
      return `NULL`;
    case "boolean":
      return input ? "1" : "0";
  }
}

export function attrToCreateQuery({
  name,
  type,
  references,
  referencesOn,
  notNullable = false,
}: DBAttr) {
  return `${name} ${type} ${
    references ? ` REFERENCES ${references} (${referencesOn})` : ""
  }`;
}

export type DBAttr = {
  name: string;
  type: dbTypes;
  references?: string;
  referencesOn?: string;
  notNullable?: boolean | null;
};
