import { useCallback, useContext, useEffect, useState } from "react";
import { TradeRouteProps } from "@Services/GameState/dbTypes";
import {
  GameStateContext,
  TradeRouteAsGeoJSONView,
} from "@Services/GameState/gameState";
import { useSelectedRouteAtom } from "@Components/hooks/useSelectedTradeRoute";
import Modal from "./Modal";
import { Label } from "@Components/label";
import { TerminalScreen } from "@Components/terminalScreen";

export default function TradeRouteModal(): JSX.Element {
  const [routeID] = useSelectedRouteAtom();

  const gameState = useContext(GameStateContext);

  const [routeData, setRouteData] = useState<TradeRouteAsGeoJSONView>();

  useEffect(() => {
    if (routeID) {
      gameState
        .getTradeRoute(routeID)
        .then(([tradeRoute]) => setRouteData(tradeRoute));
    }
  }, [routeID, gameState]);

  const header = useCallback(() => {
    return <Label type="led">{routeData?.name || ""}</Label>;
  }, [routeData?.name]);

  const body = useCallback(() => {
    return (
      <>
        <Label type="painted">Convoys on this route</Label>
        <TerminalScreen></TerminalScreen>
      </>
    );
  }, []);

  const footer = useCallback(() => {
    return <></>;
  }, []);

  if (routeData) {
    return <Modal header={header} body={body} footer={footer} />;
  } else {
    return <></>;
  }
}
