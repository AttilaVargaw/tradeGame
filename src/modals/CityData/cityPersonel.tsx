import { Grid } from "@Components/grid";

import { WarehouseRow } from "../../components/WarehouseRow";

export default function CityPersonel() {
  return (
    <Grid $num={4}>
      <WarehouseRow direction="column" label="Master" number={0} />
      <WarehouseRow direction="column" label="Mechanist" number={0} />
      <WarehouseRow direction="column" label="Researcher" number={0} />
      <WarehouseRow direction="column" label="Guard" number={0} />
      <WarehouseRow direction="column" label="Cadet" number={0} />
      <WarehouseRow direction="column" label="Crewman" number={0} />
      <WarehouseRow direction="column" label="Cook" number={0} />
      <WarehouseRow direction="column" label="Surgeon" number={0} />
    </Grid>
  );
}
