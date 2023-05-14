import { Label } from "@Components/label";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { useCallback, useContext, useEffect, useState } from "react";
import Modal from "../Modal";
import {
  GameStateContext,
  TradeRouteAsGeoJSONView,
} from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { DBEvents } from "@Services/GameState/dbTypes";

export function ConvoyTradeRouteModal() {
  const [tradeRoutes, setTraderoutes] = useState<TradeRouteAsGeoJSONView[]>();
  const [currentConvoy, setConvoyData] = useState<ConvoyData>();
  const [currentConvoyID] = useCurrentConvoy();
  const gameState = useContext(GameStateContext);
  const [currentlySelectedTradeRoute, setCurrentlySelectedTradeRoute] =
    useState<number>();

  useEffect(() => {
    function updateTraderouteList() {
      if (currentConvoyID) {
        gameState.getConvoy(currentConvoyID).then((convoyData) => {
          setConvoyData(convoyData);
          if (convoyData.route) {
            gameState.getTradeRoute(convoyData.route).then((ret) => {
              if (ret.length > 0) {
                setCurrentlySelectedTradeRoute(ret[0].ID);
              }
            });
          } else {
            setCurrentlySelectedTradeRoute(undefined);
          }
        });
      }
      gameState.getTradeRoute().then(setTraderoutes);
    }

    updateTraderouteList();

    const subscription = gameState.dbObservable.subscribe(({ type }) => {
      if (type === DBEvents.convoyUpdated) {
        updateTraderouteList();
      }
    });

    return () => subscription.unsubscribe();
  }, [gameState, currentConvoyID]);

  const header = useCallback(() => {
    return <Label type="led">{currentConvoy?.name || ""}</Label>;
  }, [currentConvoy]);

  const selectTradeRoute = useCallback(
    (ID: number | null) => () => {
      if (currentConvoyID) {
        gameState.setConvoyTradeRoute(currentConvoyID, ID);
      }
    },
    []
  );

  const body = useCallback(() => {
    return (
      <>
        <Label type="painted">Traderoutes</Label>
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
      </>
    );
  }, [currentlySelectedTradeRoute, tradeRoutes]);

  const footer = useCallback(() => {
    return <></>;
  }, []);

  return <Modal body={body} footer={footer} header={header}></Modal>;
}
