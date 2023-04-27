import { SevenDigitClock } from "@Components/SevenDigitClock";
import { Button } from "@Components/button";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { DBEvents } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styled, { CSSProperties } from "styled-components";
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
`;

function VehicleCountButton({ onClick }: { onClick: () => void }) {
  const gameState = useContext(GameStateContext);

  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    gameState.dbObservable.subscribe((type) => {
      if (type.type === DBEvents.newVehicleBought) {
        gameState.GetVehicleCount().then(setVehicleCount);
      }
    });

    gameState.GetVehicleCount().then(setVehicleCount);
  }, [gameState]);

  return (
    <Button black onClick={onClick}>
      Vehicles: {vehicleCount}
    </Button>
  );
}

function ConvoyCountButton({ onClick }: { onClick: () => void }) {
  const gameState = useContext(GameStateContext);

  const [convoyCount, setConvoyCount] = useState(0);

  useEffect(() => {
    const subscribtion = gameState.dbObservable.subscribe((type) => {
      if (type.type === DBEvents.newConvoyCreated) {
        gameState.GetConvoiyCount().then(setConvoyCount);
      }
    });

    gameState.GetConvoiyCount().then(setConvoyCount);

    return () => subscribtion.unsubscribe();
  }, [gameState]);

  return (
    <Button black onClick={onClick}>
      Convoys: {convoyCount}
    </Button>
  );
}

function AccountingButton() {
  return <Button black>5556.22 ℳ</Button>;
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

  return (
    <Container ref={ref} style={style}>
      <SevenDigitClock />
      {!currentConvoy && (
        <>
          <Button black onClick={onEncyklopediaClick}>
            Messages: 2
          </Button>
          <Button black onClick={onEncyklopediaClick}>
            Trade routes: 3
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
