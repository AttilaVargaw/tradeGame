export type JoinEquitation<TABLES = string> = {
  A: [TABLES, string | number | null];
  B: [TABLES, string | number | null];
  operator?: "=" | ">" | "<" | "<>";
};
