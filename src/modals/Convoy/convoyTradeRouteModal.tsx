import { Label } from "@Components/label";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "../Modal";

import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { DBEvents } from "@Services/GameState/dbTypes";
import { Toggle } from "@Components/toggle";
import {
  TradeRouteAsGeoJSONView,
  setConvoyTradeRoute,
  getTradeRoute,
  getConvoy,
  dbObservable,
} from "@Services/GameState/gameState";
import { ID } from "@Services/GameState/dbTypes";

export function ConvoyTradeRouteModal() {
  const [tradeRoutes, setTraderoutes] = useState<TradeRouteAsGeoJSONView[]>();
  const [currentConvoy, setConvoyData] = useState<ConvoyData>();
  const [currentConvoyID] = useCurrentConvoy();
  const [currentlySelectedTradeRoute, setCurrentlySelectedTradeRoute] =
    useState<number>();

  useEffect(() => {
    function updateTraderouteList() {
      if (currentConvoyID) {
        getConvoy(currentConvoyID).then((convoyData) => {
          setConvoyData(convoyData);
          if (convoyData.route) {
            getTradeRoute(convoyData.route).then((ret) => {
              if (ret.length > 0) {
                setCurrentlySelectedTradeRoute(ret[0].ID);
              }
            });
          } else {
            setCurrentlySelectedTradeRoute(undefined);
          }
        });
      }
      getTradeRoute().then(setTraderoutes);
    }

    updateTraderouteList();

    const subscription = dbObservable.subscribe(({ type }) => {
      if (type === DBEvents.convoyUpdated) {
        updateTraderouteList();
      }
    });

    return () => subscription.unsubscribe();
  }, [currentConvoyID]);

  const header = useMemo(() => {
    return <Label type="led">{currentConvoy?.name || ""}</Label>;
  }, [currentConvoy]);

  const activateTradeRoute = useCallback(() => {
    if (currentlySelectedTradeRoute) {
      setTradeRouteActive((value) => {
        return !value;
      });
    } else {
      setTradeRouteActive(false);
    }
  }, [currentlySelectedTradeRoute]);

  const selectTradeRoute = useCallback(
    (ID: ID | null) => () => {
      if (currentConvoyID) {
        setConvoyTradeRoute(currentConvoyID, ID);
        if (!ID) {
          activateTradeRoute();
        }
      }
    },
    [currentConvoyID, activateTradeRoute]
  );

  const [isTradeRouteActive, setTradeRouteActive] = useState(false);

  const body = useMemo(
    () => (
      <>
        <Label type="painted">Traderoutes</Label>
        <div style={{ height: "80%" }}>
          <TerminalScreen>
            {tradeRoutes?.map(({ name, ID }) => (
              <div key={ID}>
                <Link onClick={selectTradeRoute(ID)}>
                  {name}
                  {currentlySelectedTradeRoute === ID && " [X]"}
                </Link>
              </div>
            ))}
            <div>
              <Link onClick={selectTradeRoute(null)}>
                Off
                {!currentlySelectedTradeRoute && " [X]"}
              </Link>
            </div>
          </TerminalScreen>
        </div>
      </>
    ),
    [currentlySelectedTradeRoute, tradeRoutes, selectTradeRoute]
  );

  const footer = useMemo(() => {
    return (
      <>
        <Toggle
          disabled={!currentlySelectedTradeRoute}
          onChange={activateTradeRoute}
          active={isTradeRouteActive}
        >
          ON
        </Toggle>
      </>
    );
  }, [activateTradeRoute, isTradeRouteActive, currentlySelectedTradeRoute]);

  return <Modal body={body} footer={footer} header={header} />;
}
