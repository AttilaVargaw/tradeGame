import { Tables } from "@Services/GameState/tables/common";

export type JoinEquitation<T extends string> = {
  A: [T, string | number | null];
  B: [T, string | number | null];
  operator?: "=" | ">" | "<" | "<>";
};

export function joinEquitationToString<T extends string>({
  operator = "=",
  A: [A, AAttr],
  B: [B, BAttr],
}: JoinEquitation<T>) {
  return `${A}.${AAttr}${operator}${B}.${BAttr}`;
}

export type Join<T extends string> = {
  A: T;
  equation: JoinEquitation<T>;
  as?: string;
};
