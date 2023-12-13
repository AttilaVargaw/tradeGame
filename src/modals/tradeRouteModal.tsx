import { useCallback, useMemo } from "react";

import { Label } from "@Components/label";
import { TerminalScreen } from "@Components/terminalScreen";
import { useDBValue } from "@Hooks/index";
import { useSelectedRouteAtom } from "@Hooks/index";
import { getTradeRouteByID } from "@Services/GameState/queries/tradeRoute";

import Modal from "./Modal";

const body = (
  <>
    <Label type="painted">Convoys on this route</Label>
    <TerminalScreen />
  </>
);

export default function TradeRouteModal(): React.ReactElement | false {
  const [routeID] = useSelectedRouteAtom();

  const routeData = useDBValue(
    useCallback(() => getTradeRouteByID(routeID), [routeID])
  );

  const header = useMemo(() => {
    return <Label type="led">{routeData?.name ?? ""}</Label>;
  }, [routeData?.name]);

  return !!routeData && <Modal header={header} body={body} />;
}
