import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { getConvoy } from "@Services/GameState/gameState";

import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";

export const ConvoyInfo = () => {
  const [currentConvoy] = useCurrentConvoy();
  const [convoyData, setConvoyData] = useState<ConvoyData>();

  useEffect(() => {
    if (currentConvoy) {
      getConvoy(currentConvoy).then(setConvoyData);
    }
  }, [currentConvoy]);

  return (
    <Container style={{ display: "grid" }}>
      <div>{convoyData?.name}</div>
      <div>Assigned route</div>
      <div>{convoyData?.route}</div>
    </Container>
  );
};
