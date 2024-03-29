import { isNull, isUndefined } from "lodash-es";

import { DBEvents } from "@Services/GameState/dbTypes";
import { db, dbObservable } from "@Services/GameState/gameState";
import {
  ID,
  insert,
  select,
} from "@Services/GameState/utils/SimpleQueryBuider";
import { Delete } from "@Services/GameState/utils/SimpleQueryBuider/delete";
import { GroupBy } from "@Services/utils";

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

const getShippingPlanQuery = select<ShippingPlan, "ShippingPlans">({
  table: "ShippingPlans",
  attributes: [["ShippingPlans", ["ID", "name"]]],
});

const getShippingPlanRoutesQuery = select<
  TradeRoute & ShippingPlanRoute,
  "ShippingPlanRoutes" | "TradeRoutes"
>({
  table: "ShippingPlanRoutes",
  attributes: [
    ["TradeRoutes", ["name", "CityA", "CityB"]],
    ["ShippingPlanRoutes", ["ID"]],
  ],
  join: [
    {
      A: "TradeRoutes",
      equation: {
        A: ["TradeRoutes", "ID"],
        B: ["ShippingPlanRoutes", "route"],
      },
    },
  ],
});

export async function getShippingPlan(id: ID | null) {
  if (isNull(id)) {
    return null;
  }

  return (await db.select<ShippingPlan[]>(getShippingPlanQuery))[0];
}

export async function getShippingPlanRoutes(id: ID | null) {
  if (isNull(id)) {
    return null;
  }

  return await db.select<TradeRoute[]>(getShippingPlanRoutesQuery);
}

const getShippingPlanItemsQuery = select<
  ShippingPlanExchange & Item & Translations,
  "ShippingPlans" | "ShippingPlanExchanges" | "Item" | "translations"
>({
  table: "Item",
  attributes: [
    ["Item", ["ID", "nameKey", "descriptionKey", "weight", "category"]],
    ["ShippingPlanExchanges", ["number"]],
    ["translations", ["key", "lang", "translation"]],
  ],
  //where: [{ A: ["ShippingPlanExchanges", "plan"], value: "?" }],
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
});

// @TODO
export async function moveBetweenInventories(
  plan: ID,
  amount: number,
  item: ID
) {
  await Promise.all([
    db.execute(
      "insert into ShippingPlanExchanges (item, number, plan) values(?, ?, ?) ON CONFLICT (item, plan) DO UPDATE SET number = ? WHERE plan=? and item = ?;",
      [item, amount, plan, amount, plan, item]
    ),
  ]);

  dbObservable.next({
    type: DBEvents.shippingPlanUpdate,
  });
}

export async function getShippingPlanItems(id: ID | null) {
  if (isNull(id)) {
    return new Map<number, (ShippingPlanExchange & Item & Translations)[]>();
  }

  return GroupBy(
    (
      await db.select<(ShippingPlanExchange & Item & Translations)[]>(
        getShippingPlanItemsQuery,
        [id]
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
