import { useEffect, useMemo, useState } from "react";

import { useSelectedRouteAtom } from "@Components/hooks/useSelectedTradeRoute";
import Modal from "./Modal";
import { Label } from "@Components/label";
import { TerminalScreen } from "@Components/terminalScreen";
import {
  TradeRouteAsGeoJSONView,
  getTradeRoute,
} from "@Services/GameState/queries/tradeRoute";

export default function TradeRouteModal(): JSX.Element | false {
  const [routeID] = useSelectedRouteAtom();

  const [routeData, setRouteData] = useState<TradeRouteAsGeoJSONView>();

  useEffect(() => {
    if (routeID) {
      getTradeRoute(routeID).then(([tradeRoute]) => setRouteData(tradeRoute));
    }
  }, [routeID]);

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
