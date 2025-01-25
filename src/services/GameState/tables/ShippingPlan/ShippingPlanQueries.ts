import { isNull } from "lodash-es";

import { DBEvents } from "@Services/GameState/dbTypes";
import { db, dbObservable } from "@Services/GameState/gameState";
import {
  ID,
  insert,
  select,
} from "@Services/GameState/utils/SimpleQueryBuider";
import { Delete } from "@Services/GameState/utils/SimpleQueryBuider/delete";
import { GroupBy } from "@Services/utils";

import { CityData } from "../City/CityTable";
import { TradeRoute } from "../TradeRoutes";
import { Translations } from "../Translations";
import { Item } from "../common";
import { ShippingPlan } from "./ShippingPlan";
import { ShippingPlanExchange } from "./ShippingPlanExchange";
import { ShippingPlanRoute } from "./ShippingPlanRoutes";

export async function addRouteToShipping(id: ID | null, plan: ID | null) {
  await db.execute(
    insert<Pick<ShippingPlanRoute, "plan" | "route">, "ShippingPlanRoutes">({
      attributes: { plan: plan, route: id },
      table: "ShippingPlanRoutes",
    }),
    [plan, id]
  );

  await db.execute(
    insert<Pick<ShippingPlanRoute, "plan" | "route">, "ShippingPlanRoutes">({
      attributes: { plan: plan, route: id },
      table: "ShippingPlanRoutes",
    }),
    [plan, id]
  );

  dbObservable.next({
    type: DBEvents.shippingPlanUpdate,
  });
}

export async function deleteRouteFromShipping(id: ID) {
  await db.execute(
    Delete<ShippingPlanRoute, "ShippingPlanRoutes">({
      where: [{ A: ["ShippingPlanRoutes", "ID"], value: id }],
      table: "ShippingPlanRoutes",
    })
  );

  dbObservable.next({
    type: DBEvents.shippingPlanUpdate,
  });
}

const getShippingPlanQuery = select<
  ShippingPlan & CityData,
  "ShippingPlans" | "inventory"
>({
  table: "ShippingPlans",
  attributes: [["ShippingPlans", ["ID", "name"]]],
  where: [
    { A: ["inventory", "ID"], value: "$1" },
    { A: ["ShippingPlans", "ID"], value: "$2" },
  ],
  join: [
    {
      A: "inventory",
      equation: { A: ["inventory", "ID"], B: ["ShippingPlans", "inventory"] },
    },
  ],
});

const getShippingPlansQuery = select<
  ShippingPlan & CityData,
  "ShippingPlans" | "inventory"
>({
  table: "ShippingPlans",
  attributes: [["ShippingPlans", ["ID", "name"]]],
  where: [{ A: ["ShippingPlans", "ID"], value: "$1" }],
});

const getShippingPlanRoutesQuery = select<
  TradeRoute & ShippingPlanRoute & { cityAName: string; cityBName: string },
  "ShippingPlanRoutes" | "TradeRoutes" | "CityA" | "CityB" | "City"
>({
  table: "ShippingPlanRoutes",
  attributes: [
    ["TradeRoutes", ["name", "CityA", "CityB"]],
    ["ShippingPlanRoutes", ["ID"]],
    ["CityA", ["name as cityAName"]],
    ["CityB", ["name as cityBName"]],
  ],
  join: [
    {
      A: "TradeRoutes",
      equation: {
        A: ["TradeRoutes", "ID"],
        B: ["ShippingPlanRoutes", "route"],
      },
    },
    {
      A: "City",
      equation: {
        A: ["TradeRoutes", "CityA"],
        B: ["CityA", "ID"],
      },
      as: "CityA",
    },
    {
      A: "City",
      equation: {
        A: ["TradeRoutes", "CityB"],
        B: ["CityB", "ID"],
      },
      as: "CityB",
    },
  ],
});

export async function getShippingPlan(id: ID | null, inventory: ID) {
  if (isNull(id)) {
    return null;
  }

  return (
    await db.select<ShippingPlan[]>(getShippingPlanQuery, [inventory, id])
  )[0];
}

export async function getShippingPlans(id?: ID | null) {
  if (isNull(id)) {
    return null;
  }

  return await db.select<[ShippingPlan, ShippingPlan]>(getShippingPlansQuery, [
    id,
  ]);
}

export async function getShippingPlanRoutes(id?: ID | null) {
  if (isNull(id)) {
    return null;
  }

  return await db.select<
    (TradeRoute & { cityAName: string; cityBName: string })[]
  >(getShippingPlanRoutesQuery);
}

const getShippingPlanItemsQuery = (id: ID, start: boolean) =>
  select<
    ShippingPlanExchange & Item & Translations,
    "ShippingPlans" | "ShippingPlanExchanges" | "Item" | "translations"
  >({
    table: "Item",
    attributes: [
      ["Item", ["ID", "nameKey", "descriptionKey", "weight", "category"]],
      ["ShippingPlanExchanges", ["number"]],
      ["translations", ["key", "lang", "translation"]],
    ],
    join: [
      {
        A: "ShippingPlanExchanges",
        equation: {
          A: ["Item", "ID"],
          B: ["ShippingPlanExchanges", "item"],
        },
        type: "left outer",
      },
      {
        A: "translations",
        equation: { A: ["Item", "nameKey"], B: ["translations", "key"] },
      },
    ],
    where: [
      { A: ["ShippingPlanExchanges", "plan"], value: id },
      {
        A: ["ShippingPlanExchanges", "start"],
        value: Number(start),
      },
    ],
  });

// @TODO
export async function moveBetweenInventories(
  plan: ID,
  amount: number,
  item: ID,
  start: boolean
) {
  const t = await Promise.all([
    db.execute(
      "insert into ShippingPlanExchanges (item, number, plan, start) values(?, ?, ?, ?) ON CONFLICT (item, plan, start) DO UPDATE SET number = ? WHERE plan=? and item = ? and start = ?;",
      [item, amount, plan, Number(start), amount, plan, item, Number(start)]
    ),
  ]);
  console.log(t);

  dbObservable.next({
    type: DBEvents.shippingPlanUpdate,
  });
}

export async function getShippingPlanItems(id: ID | null, start: boolean) {
  if (isNull(id)) {
    return new Map<number, (ShippingPlanExchange & Item & Translations)[]>();
  }

  return GroupBy(
    (
      await db.select<(ShippingPlanExchange & Item & Translations)[]>(
        getShippingPlanItemsQuery(id, start),
        [id, start]
      )
    ).map((change) => {
      if (isNull(change.number)) {
        change.number = 0;
      }
      change.plan = id;
      return change;
    }),
    "category"
  );
}
