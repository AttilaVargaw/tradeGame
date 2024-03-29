import { useCallback, useMemo } from "react";

import { Label } from "@Components/label";
import { useDBValue } from "@Hooks/index";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { DBEvents } from "@Services/GameState/dbTypes";
import { getShippingPlan } from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";

import Modal from "../../Modal";
import { ShippingPlannerRoutes } from "./ShippingPlannerRoutes";

const updateEvents = [DBEvents.shippingPlanUpdate];

export function ShippingPlannerRoutesModal() {
  const [currentShippingPlan] = useCurrentShippingPlan();

  const plan = useDBValue(
    useCallback(
      () => getShippingPlan(currentShippingPlan),
      [currentShippingPlan]
    ),
    updateEvents
  );

  const body = useMemo(
    () => <ShippingPlannerRoutes plan={currentShippingPlan} />,
    [currentShippingPlan]
  );

  const footer = useMemo(() => <></>, []);

  const header = useMemo(
    () => <Label type="painted">{plan?.name ?? ""}</Label>,
    [plan?.name]
  );

  return <Modal body={body} footer={footer} header={header} />;
}
