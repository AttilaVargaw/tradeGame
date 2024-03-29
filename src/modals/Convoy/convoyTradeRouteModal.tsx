import { useCallback, useMemo } from "react";

import { StackPager } from "@Components/StackPager";
import { Row } from "@Components/grid";
import { Label } from "@Components/label";
import { PagerItemProps } from "@Components/pagerProps";
import { Link, PagerLink, TerminalScreen } from "@Components/terminalScreen";
import { Toggle } from "@Components/toggle";
import { useCurrentConvoy, useCurrentModal } from "@Hooks/index";
import { useDBValue } from "@Hooks/index";
import { useCurrentShippingPlan } from "@Hooks/useCurrentShippingPlan";
import { DBEvents } from "@Services/GameState/dbTypes";
import {
  TradeRouteProps,
  getAllTradeRoute,
  getTradeRouteByID,
} from "@Services/GameState/queries/tradeRoute";
import {
  getConvoy,
  setConvoyRouteActive,
  setConvoyTradeRoute,
} from "@Services/GameState/tables/Convoy/convoyQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import Modal from "../Modal";

export function TradeRouteToLink({
  ID,
  name,
}: Pick<TradeRouteProps, "ID" | "name">) {
  return {
    value: ID,
    label: name,
  };
}

const updateEvents = [DBEvents.convoyUpdated];

export function ConvoyTradeRouteModal() {
  const [currentConvoyID] = useCurrentConvoy();

  const tradeRoutes = useDBValue(getAllTradeRoute, updateEvents);

  const currentConvoy = useDBValue(
    useCallback(() => getConvoy(currentConvoyID), [currentConvoyID]),
    updateEvents
  );

  const [, setCurrentShippingPlan] = useCurrentShippingPlan();

  const [, setCurrentModal] = useCurrentModal();

  const onEdit = useCallback(
    (id: ID | null) => () => {
      setCurrentModal("ShippingPlannerRoutes");
      setCurrentShippingPlan(id);
    },
    [setCurrentModal, setCurrentShippingPlan]
  );

  const PagerLinkWithEdit = useCallback(
    (item: PagerItemProps<ID>) => {
      return (
        <Row>
          <PagerLink {...item} />
          <Link onClick={onEdit(item.value)}>Edit</Link>
        </Row>
      );
    },
    [onEdit]
  );

  const currentTraderoute = useDBValue(
    useCallback(() => getTradeRouteByID(currentConvoy?.route), [currentConvoy]),
    updateEvents
  );

  const header = useMemo(() => {
    return <Label type="led">{currentConvoy?.name || ""}</Label>;
  }, [currentConvoy]);

  const activateTradeRoute = useCallback(
    (active: boolean) =>
      currentConvoyID && setConvoyRouteActive(currentConvoyID, active),
    [currentConvoyID]
  );

  const selectTradeRoute = useCallback(
    (ID: ID | null) => {
      if (currentConvoyID) {
        setConvoyTradeRoute(currentConvoyID, ID);
      }
    },
    [currentConvoyID]
  );

  const body = useMemo(
    () => (
      <>
        <Label type="painted">Traderoutes</Label>
        <div style={{ height: "80%" }}>
          <TerminalScreen style={{ height: "100%" }}>
            {tradeRoutes && (
              <StackPager
                ItemTemplate={PagerLinkWithEdit}
                onChange={selectTradeRoute}
                values={tradeRoutes.map(TradeRouteToLink)}
                selected={currentTraderoute?.ID}
              />
            )}
            <div>
              <PagerLink
                active={!currentTraderoute}
                onChange={() => selectTradeRoute(null)}
                value={null}
              >
                Off
              </PagerLink>
            </div>
          </TerminalScreen>
        </div>
      </>
    ),
    [tradeRoutes, PagerLinkWithEdit, selectTradeRoute, currentTraderoute]
  );

  const footer = useMemo(() => {
    return (
      <Toggle
        disabled={!currentTraderoute}
        onChange={activateTradeRoute}
        active={!!currentConvoy?.isRouteActive}
      >
        ON
      </Toggle>
    );
  }, [currentTraderoute, activateTradeRoute, currentConvoy?.isRouteActive]);

  return <Modal body={body} footer={footer} header={header} />;
}
