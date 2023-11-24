import { Label } from "@Components/label";
import styled from "styled-components";
import { WarehouseTransferItem } from "../../../components/WarehouseTransferItem";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  margin-top: 1em;
`;

export function CityVehiclesCrew() {
  return (
    <Container>
      <div></div>
      <Label type="painted">City</Label>
      <div></div>
      <Label type="led">test2</Label>
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Master"
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Mechanist"
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Researcher"
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Guard"
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Cadet"
      />
    </Container>
  );
}
