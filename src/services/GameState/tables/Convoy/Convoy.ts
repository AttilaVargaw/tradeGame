import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { TableData } from "../common";

export type ConvoyData = {
  name: string;
  type: string;
  ID: ID;
  posY: number;
  posX: number;
  route: number | null;
  goalY: number | null;
  goalX: number | null;
  goalVectorX: number | null;
  goalVectorY: number | null;
  dockedTo: number | null;
  isRouteActive: boolean;
  shippingPlan: ID;
};

export type ConvoyTableName = "Convoy";

export default {
  name: "Convoy",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "posY", type: "REAL" },
    { name: "posX", type: "REAL" },
    { name: "type", type: "INTEGER" },
    { name: "shippingPlan", type: "INTEGER" },
    { name: "goalY", type: "REAL" },
    { name: "goalX", type: "REAL" },
    { name: "dockedTo", type: "INTEGER" },
    { name: "isRouteActive", type: "INTEGER" },
  ],
  initData: [
    { name: "Test Convoy", type: "1", posY: 3340, posX: 1040, shippingPlan: 1 },
  ],
} as TableData<ConvoyData>;
