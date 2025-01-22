import { PagerProps } from "@Components/pagerProps";

export const categorySelectorElements = [
  { value: 0, label: "Human necessities" },
  { value: 1, label: "Weapons" },
  { value: 2, label: "Industrial goods" },
] as PagerProps<number>["values"];
