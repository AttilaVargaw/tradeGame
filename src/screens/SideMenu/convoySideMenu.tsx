import { useCallback } from "react";

import { Col, Row } from "@Components/grid";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { Toggle } from "@Components/toggle";
import { useCurrentConvoy, useDBValue } from "@Hooks/index";
import { useCurrentModal } from "@Hooks/useCurrentModal";
import { DBEvents } from "@Services/GameState/dbTypes";
import { getTradeRouteByID } from "@Services/GameState/queries/tradeRoute";
import {
  getConvoy,
  setConvoyRouteActive,
} from "@Services/GameState/tables/Convoy/convoyQueries";

function LineRowWithDefault({
  defaultText: defaultText,
  onLinkClick,
  value,
  label,
  onDefaultClick,
}: {
  value?: string;
  onLinkClick?: () => void;
  onDefaultClick?: () => void;
  defaultText: string;
  label: string;
}) {
  return (
    <Row>
      {label}{" "}
      {value ? (
        <Link onClick={onLinkClick}>{value}</Link>
      ) : (
        <Link onClick={onDefaultClick ?? onLinkClick}>{defaultText}</Link>
      )}
    </Row>
  );
}

const updateEvents = [DBEvents.convoyUpdated];

export function ConvoySideMenu() {
  const [currentConvoyID] = useCurrentConvoy();
  const [, setCurrentModal] = useCurrentModal();

  const convoyData = useDBValue(
    useCallback(() => getConvoy(currentConvoyID), [currentConvoyID]),
    updateEvents
  );

  const routeData = useDBValue(
    useCallback(
      () => getTradeRouteByID(convoyData?.route),
      [convoyData?.route]
    ),
    updateEvents
  );

  const openConvoyModals = () => setCurrentModal("convoyTradeRoute");

  const openShippingPlanner = () => setCurrentModal("shippingPlanner");

  const activateTradeRoute = () => {
    convoyData &&
      setConvoyRouteActive(convoyData.ID, !convoyData.isRouteActive);
  };

  return (
    <Col>
      <TerminalScreen rows={10}>
        <LineRowWithDefault
          onLinkClick={openConvoyModals}
          defaultText="none"
          label="Current route:"
          value={routeData?.name}
        />
        <LineRowWithDefault defaultText="none" label="Current goal:" />
        {convoyData?.dockedTo && (
          <LineRowWithDefault
            defaultText="none"
            value={convoyData.dockedTo.toString()}
            label="Docked to:"
          />
        )}
        <LineRowWithDefault
          defaultText="none"
          label="Current program:"
          onLinkClick={openShippingPlanner}
        />
      </TerminalScreen>
      <Toggle
        onChange={activateTradeRoute}
        active={!!convoyData?.isRouteActive}
        disabled={!convoyData?.route}
      >
        ON
      </Toggle>
    </Col>
  );
}
