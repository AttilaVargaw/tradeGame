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

  const routeData = useDBValue(() => getTradeRouteByID(routeID));

  const header = <Label type="led">{routeData?.name ?? ""}</Label>;

  return !!routeData && <Modal header={header} body={body} />;
}
