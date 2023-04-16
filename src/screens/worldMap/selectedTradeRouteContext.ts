import { createContext } from "react";

export const SelectedTradeRouteContext = createContext<string | undefined>(
  undefined
);
