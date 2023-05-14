import { Button } from "@Components/button";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { Toggle } from "@Components/toggle";
import { useCallback, useState } from "react";

export function ConvoySideMenu() {
  const [isTradeRouteActive, setTradeRouteActive] = useState(false);
  const [, setCurrentModal] = useCurrentModal();

  const onTradeRouteClick = useCallback(() => {
    setCurrentModal("convoyTradeRoute");
  }, [setCurrentModal]);

  return (
    <>
      <div>
        <Button onClick={onTradeRouteClick}>Trade Route</Button>
        <Toggle onChange={setTradeRouteActive} active={isTradeRouteActive}>
          ON
        </Toggle>
      </div>
    </>
  );
}
