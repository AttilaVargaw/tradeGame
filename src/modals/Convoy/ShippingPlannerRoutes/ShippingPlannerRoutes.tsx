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

  const addRoute = useCallback(() => {
    setAddState(true);
  }, []);

  const back = useCallback(() => {
    setAddState(false);
  }, []);

  const addThisRoute = useCallback(
    (id: ID) => () => {
      addRouteToShipping(id, plan);
      setAddState(false);
    },
    [plan]
  );

  const [addState, setAddState] = useState(false);

  const onDelete = useCallback(
    (id: ID) => () => {
      deleteRouteFromShipping(id);
    },
    []
  );

  const [, setCurrentModal] = useCurrentModal();

  const [, setCurrentShippingPlan] = useCurrentShippingPlan();

  const onRouteClick = useCallback(
    (routeID: ID) => () => {
      setCurrentShippingPlan(routeID);
      setCurrentModal("shippingPlanner");
    },
    [setCurrentModal, setCurrentShippingPlan]
  );

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
          {tradeRoutes?.map(({ ID, name }) => (
            <Link key={ID} onClick={addThisRoute(ID)}>
              {name}
            </Link>
          ))}
          <Link onClick={back}>Back</Link>
        </>
      )}
    </TerminalScreen>
  );
}
