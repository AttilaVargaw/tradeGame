import { SevenDigitClock } from "@Components/SevenDigitClock";
import { Button } from "@Components/button";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { DBEvents } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import { useCallback, useContext, useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";

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

function VehicleCountButton() {
  const gameState = useContext(GameStateContext);

  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    gameState.dbObservable.subscribe((type) => {
      if (type.type === DBEvents.newVehicleBought) {
        gameState.GetVehicleCount().then(setVehicleCount);
        gameState.GetVehicleCount().then(console.log);
      }
    });
  }, [gameState]);

  return <Button black>Vehicles {vehicleCount}</Button>;
}

function AccountingButton() {
  return <Button black>5556.22 ℳ</Button>;
}

export default function SideMenu({ style }: { style: CSSProperties }) {
  const [, setCurrentModal] = useCurrentModal();

  const onConvoysClick = useCallback(() => {
    setCurrentModal("convoys");
  }, [setCurrentModal]);

  const onVehiclesClick = useCallback(() => {
    setCurrentModal("buyVehicle");
  }, [setCurrentModal]);

  return (
    <Container style={style}>
      <SevenDigitClock />
      <AccountingButton />
      <VehicleCountButton />
      <Button onClick={onConvoysClick}>Convoys</Button>
      <Button onClick={onVehiclesClick}>New Vehicle</Button>
    </Container>
  );
}
