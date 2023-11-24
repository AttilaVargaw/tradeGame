import styled from "styled-components";
import { WarehouseRow } from "../../components/WarehouseRow";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

export default function CityPersonel() {
  return (
    <Container>
      <WarehouseRow direction="column" label="Master" number={0} />
      <WarehouseRow direction="column" label="Mechanist" number={0} />
      <WarehouseRow direction="column" label="Researcher" number={0} />
      <WarehouseRow direction="column" label="Guard" number={0} />
      <WarehouseRow direction="column" label="Cadet" number={0} />
    </Container>
  );
}
