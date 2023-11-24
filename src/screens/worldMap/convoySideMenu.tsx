import { useCallback, useEffect, useState } from "react";

import { Button } from "@Components/button";
import { ConvoyData } from "@Services/GameState/tables/Convoy/Convoy";
import { TerminalScreen } from "@Components/terminalScreen";
import { Toggle } from "@Components/toggle";
import { getConvoy } from "@Services/GameState/tables/Convoy/convoyQueries";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";

export function ConvoySideMenu() {
  const [isTradeRouteActive, setTradeRouteActive] = useState(false);
  const [, setCurrentModal] = useCurrentModal();
  const [currentConvoy, setConvoyData] = useState<ConvoyData>();
  const [currentConvoyID] = useCurrentConvoy();

  const onTradeRouteClick = useCallback(() => {
    setCurrentModal("convoyTradeRoute");
  }, [setCurrentModal]);

  useEffect(() => {
    if (currentConvoyID) {
      getConvoy(currentConvoyID).then((convoyData) => {
        setConvoyData(convoyData);
      });
    }
  }, [currentConvoyID]);

  return (
    <>
      <div>
        <TerminalScreen>
          <div>Current route: {currentConvoy?.route || "None"}</div>
          <div>Current goal: {currentConvoy?.route || "None"}</div>
        </TerminalScreen>
        <Button onClick={onTradeRouteClick}>Trade Route</Button>
        <Toggle onChange={setTradeRouteActive} active={isTradeRouteActive}>
          ON
        </Toggle>
      </div>
    </>
  );
}
