import { useCallback, useState } from "react";

import { Row } from "@Components/grid";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { useCurrentModal } from "@Hooks/useCurrentModal";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { useDBValue } from "@Hooks/useDBValue";
import { DBEvents } from "@Services/GameState/dbTypes";
import { getAllTradeRoute } from "@Services/GameState/queries/tradeRoute";
import {
  addRouteToShipping,
  deleteRouteFromShipping,
  getShippingPlanRoutes,
} from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

const updateEvents = [DBEvents.shippingPlanUpdate];

/*const exchanges = useDBValue(
  useCallback(() => getShippingPlanItems(currentPlan), []),
  updateEvents
);*/

export function ShippingPlannerRoutes({ plan }: { plan: ID | null }) {
  const currentRoutes = useDBValue(
    useCallback(() => getShippingPlanRoutes(plan), [plan]),
    updateEvents
  );

  const tradeRoutes = useDBValue(getAllTradeRoute, updateEvents);

  const addRoute = () => {
    setAddState(true);
  };

  const back = () => {
    setAddState(false);
  };

  const addThisRoute = (id: ID, cityAID: ID, cityBID: ID) => () => {
    addRouteToShipping(id, plan, cityAID, cityBID);
    setAddState(false);
  };

  const [addState, setAddState] = useState(false);

  const onDelete = (id: ID) => () => {
    deleteRouteFromShipping(id);
  };

  const [, setCurrentModal] = useCurrentModal();

  const [, setCurrentShippingPlan] = useCurrentShippingPlan();

  const onRouteClick = (routeID: ID) => () => {
    setCurrentShippingPlan(routeID);
    setCurrentModal("shippingPlanner");
  };

  return (
    <TerminalScreen style={{ height: "80%" }}>
      {!addState ? (
        <>
          {currentRoutes?.map(({ name, ID }) => (
            <Row key={ID}>
              <Link onClick={onRouteClick(ID)}>{name}</Link>
              <Link onClick={onDelete(ID)}>X</Link>
            </Row>
          ))}
          <Link onClick={addRoute}>Add</Link>
        </>
      ) : (
        <>
          {tradeRoutes?.map(({ ID, name, cityAID, cityBID }) => (
            <Link key={ID} onClick={addThisRoute(ID, cityAID, cityBID)}>
              {name}
            </Link>
          ))}
          <Link onClick={back}>Back</Link>
        </>
      )}
    </TerminalScreen>
  );
}
