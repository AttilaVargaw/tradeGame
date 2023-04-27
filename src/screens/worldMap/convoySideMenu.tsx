import { Button } from "@Components/button";
import { Toggle } from "@Components/toggle";
import { useState } from "react";

export function ConvoySideMenu() {
  const [isTradeRouteActive, setTradeRouteActive] = useState(false);

  return (
    <>
      <div>
        <Button>Trade Route</Button>
        <Toggle onChange={setTradeRouteActive} active={isTradeRouteActive}>
          ON
        </Toggle>
      </div>
    </>
  );
}
