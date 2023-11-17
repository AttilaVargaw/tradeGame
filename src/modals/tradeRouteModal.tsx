import { useContext, useEffect, useMemo, useState } from "react";
import {
  GameStateContext,
  TradeRouteAsGeoJSONView,
} from "@Services/GameState/gameState";
import { useSelectedRouteAtom } from "@Components/hooks/useSelectedTradeRoute";
import Modal from "./Modal";
import { Label } from "@Components/label";
import { TerminalScreen } from "@Components/terminalScreen";

export default function TradeRouteModal(): JSX.Element | false {
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

  const header = useMemo(() => {
    return <Label type="led">{routeData?.name || ""}</Label>;
  }, [routeData?.name]);

  const body = useMemo(() => {
    return (
      <>
        <Label type="painted">Convoys on this route</Label>
        <TerminalScreen />
      </>
    );
  }, []);

  return !!routeData && <Modal header={header} body={body} />;
}
