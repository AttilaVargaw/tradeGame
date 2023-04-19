export type WhereEquitation<TABLE = string> = {
  A: [TABLE, string];
  operator?: "=" | ">" | "<" | "<>" | " is " | " is not ";
  value: string | number | null;
};
