import { useCallback, useMemo } from "react";

import { Label } from "@Components/label";
import { useDBValue } from "@Hooks/index";
import { DBEvents } from "@Services/GameState/dbTypes";
import { getShippingPlan } from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";

import Modal from "../Modal";
import { ShippingPlannerRoutes } from "./ShippingPlannerRoutes";

const updateEvents = [DBEvents.shippingPlanUpdate];

const currentPlan = 0;

export function ShippingPlannerModal() {
  const plan = useDBValue(
    useCallback(() => getShippingPlan(currentPlan), []),
    updateEvents
  );

  const body = useMemo(() => <ShippingPlannerRoutes plan={currentPlan} />, []);

  const footer = useMemo(() => <></>, []);

  const header = useMemo(
    () => <Label type="painted">{plan?.name ?? ""}</Label>,
    [plan?.name]
  );

  return <Modal body={body} footer={footer} header={header} />;
}
