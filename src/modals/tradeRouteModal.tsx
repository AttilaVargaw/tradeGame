import { useCallback, useMemo } from "react";

import { useDBValue } from "@Components/hooks/useDBValue";
import { useSelectedRouteAtom } from "@Components/hooks/useSelectedTradeRoute";
import { Label } from "@Components/label";
import { TerminalScreen } from "@Components/terminalScreen";
import { getTradeRouteByID } from "@Services/GameState/queries/tradeRoute";

import Modal from "./Modal";

const body = (
  <>
    <Label type="painted">Convoys on this route</Label>
    <TerminalScreen />
  </>
);

export default function TradeRouteModal(): JSX.Element | false {
  const [routeID] = useSelectedRouteAtom();

  const routeData = useDBValue(
    useCallback(() => getTradeRouteByID(routeID), [routeID])
  );

  const header = useMemo(() => {
    return <Label type="led">{routeData?.name ?? ""}</Label>;
  }, [routeData?.name]);

  return !!routeData && <Modal header={header} body={body} />;
}
