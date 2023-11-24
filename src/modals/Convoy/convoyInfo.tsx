import { useEffect, useState } from "react";

import { ConvoyData } from "@Services/GameState/tables/Convoy/Convoy";
import { getConvoy } from "@Services/GameState/tables/Convoy/convoyQueries";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";

export const ConvoyInfo = () => {
  const [currentConvoy] = useCurrentConvoy();
  const [convoyData, setConvoyData] = useState<ConvoyData>();

  useEffect(() => {
    if (currentConvoy) {
      getConvoy(currentConvoy).then(setConvoyData);
    }
  }, [currentConvoy]);

  return (
    <div style={{ display: "grid" }}>
      <div>{convoyData?.name}</div>
      <div>Assigned route</div>
      <div>{convoyData?.route}</div>
    </div>
  );
};
