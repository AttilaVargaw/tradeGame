import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { GameStateContext } from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";

export const ConvoyInfo = () => {
  const gameState = useContext(GameStateContext);
  const [currentConvoy] = useCurrentConvoy();
  const [convoyData, setConvoyData] = useState<ConvoyData>();

  useEffect(() => {
    if (currentConvoy) {
      gameState.getConvoy(currentConvoy).then(setConvoyData);
    }
  }, [currentConvoy, gameState]);

  return (
    <Container style={{ display: "grid" }}>
      <div>{convoyData?.name}</div>
      <div>Assigned route</div>
      <div>{convoyData?.route}</div>
    </Container>
  );
};
