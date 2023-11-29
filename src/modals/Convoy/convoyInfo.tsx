import { useCallback } from "react";

import { Grid } from "@Components/grid";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useDBValue } from "@Components/hooks/useDBValue";
import { getConvoy } from "@Services/GameState/tables/Convoy/convoyQueries";

export const ConvoyInfo = () => {
  const [currentConvoy] = useCurrentConvoy();

  const convoyData = useDBValue(
    useCallback(() => getConvoy(currentConvoy), [currentConvoy])
  );

  return (
    <Grid $num={3}>
      <div>{convoyData?.name}</div>
      <div>Assigned route</div>
      <div>{convoyData?.route}</div>
    </Grid>
  );
};
