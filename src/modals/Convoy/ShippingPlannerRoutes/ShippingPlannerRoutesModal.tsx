import { useCallback } from "react";

import { Label } from "@Components/label";
import { useDBValue } from "@Hooks/index";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  getShippingPlan,
  getShippingPlans,
} from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";

import Modal from "../../Modal";
import { ShippingPlannerRoutes } from "./ShippingPlannerRoutes";

const updateEvents = [DBEvents.shippingPlanUpdate];

export function ShippingPlannerRoutesModal() {
  const [currentShippingPlan] = useCurrentShippingPlan();

  const plan = useDBValue(
    useCallback(
      () => getShippingPlans(currentShippingPlan),
      [currentShippingPlan]
    ),
    updateEvents
  );

  const body = <ShippingPlannerRoutes plan={currentShippingPlan} />;
  const footer = <></>;

  const header = <Label type="painted">{plan?.[0]?.name ?? ""}</Label>;

  return <Modal body={body} footer={footer} header={header} />;
}
