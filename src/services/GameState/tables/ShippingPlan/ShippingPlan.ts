import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { TEXT, TableData } from "../common";

export type ShippingPlan = {
  ID: ID;
  name: TEXT;
};

// export default {
//   name: "ShippingPlans",
//   createData: [
//     { name: "name", type: "TEXT" },
//     { name: "inventoryA", type: "INTEGER" },
//     { name: "inventoryB", type: "INTEGER" },
//   ],
//   initData: [{ inventoryA: 0, inventoryB: 0, name: "test" }],
// } as TableData<ShippingPlan>;

export default {
  name: "ShippingPlans",
  createData: [{ name: "name", type: "TEXT" }],
  initData: [{ name: "test" }],
} as TableData<ShippingPlan>;
