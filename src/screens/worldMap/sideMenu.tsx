import { forwardRef, useCallback, useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";

import { SevenDigitClock } from "@Components/SevenDigitClock";
import { Button } from "@Components/button";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { DBEvents } from "@Services/GameState/dbTypes";
import { dbObservable } from "@Services/GameState/gameState";
import {
  GetConvoiyCount,
  GetTraderouteCount,
} from "@Services/GameState/tables/Convoy/convoyQueries";
import { GetVehicleCount } from "@Services/GameState/tables/Vehicle/vehiclesQueries";

import { ConvoySideMenu } from "./convoySideMenu";

const Container = styled.div`
  position: fixed;
  right: 0;
  background: darkgray;
  border: 1px 1px 1px 1px solid #111;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

function VehicleCountButton({ onClick }: { onClick: () => void }) {
  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    dbObservable.subscribe((type) => {
      if (type.type === DBEvents.newVehicleBought) {
        GetVehicleCount().then(setVehicleCount);
      }
    });

    GetVehicleCount().then(setVehicleCount);
  }, []);

  return (
    <Button $black onClick={onClick}>
      Vehicles: {vehicleCount}
    </Button>
  );
}

function ConvoyCountButton({ onClick }: { onClick: () => void }) {
  const [convoyCount, setConvoyCount] = useState(0);

  useEffect(() => {
    const subscribtion = dbObservable.subscribe((type) => {
      if (type.type === DBEvents.newConvoyCreated) {
        GetConvoiyCount().then(setConvoyCount);
      } else if (type.type === DBEvents.tradeRouteUpdate) {
        console.log(type.data);
      }
    });

    GetConvoiyCount().then(setConvoyCount);

    return () => subscribtion.unsubscribe();
  }, []);

  return (
    <Button $black onClick={onClick}>
      Convoys: {convoyCount}
    </Button>
  );
}

function AccountingButton() {
  return <Button $black>5556.22 ℳ</Button>;
}

export default forwardRef<
  HTMLDivElement,
  {
    style?: CSSProperties;
  }
>(function SideMenu({ style }, ref) {
  const [, setCurrentModal] = useCurrentModal();
  const [currentConvoy] = useCurrentConvoy();

  const onConvoysClick = useCallback(() => {
    setCurrentModal("convoys");
  }, [setCurrentModal]);

  const onVehiclesClick = useCallback(() => {
    setCurrentModal("vehicle");
  }, [setCurrentModal]);

  const onEncyklopediaClick = useCallback(() => {
    setCurrentModal("encyclopedia");
  }, [setCurrentModal]);

  const [tradeRouteNum, setTradeRouteNum] = useState(0);

  useEffect(() => {
    GetTraderouteCount().then(setTradeRouteNum);

    dbObservable.subscribe(({ type }) => {
      if (type === DBEvents.tradeRouteAdded) {
        GetTraderouteCount().then(setTradeRouteNum);
      }
    });
  }, []);

  return (
    <Container ref={ref} style={style}>
      <SevenDigitClock />
      {!currentConvoy && (
        <>
          <Button $black onClick={onEncyklopediaClick}>
            Messages: 2
          </Button>
          <Button $black onClick={onEncyklopediaClick}>
            Trade routes: {tradeRouteNum}
          </Button>
          <AccountingButton />
          <VehicleCountButton onClick={onVehiclesClick} />
          <ConvoyCountButton onClick={onConvoysClick} />
          <Button onClick={onEncyklopediaClick}>Encyclopedia</Button>
          <Button onClick={onEncyklopediaClick}>Command Staff</Button>
          <Button onClick={onEncyklopediaClick}>Human Rescources</Button>
        </>
      )}
      {currentConvoy && <ConvoySideMenu />}
    </Container>
  );
});
