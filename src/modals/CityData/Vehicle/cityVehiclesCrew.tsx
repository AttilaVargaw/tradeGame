import styled from "styled-components";

import { Label } from "@Components/label";

import { WarehouseTransferItem } from "../../../components/WarehouseTransferItem";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  margin-top: 1em;
`;

export function CityVehiclesCrew() {
  return (
    <Container>
      <div />
      <Label type="painted">City</Label>
      <div />
      <Label type="led">test2</Label>
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Master"
        item={1}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Engineer"
        item={2}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Researcher"
        item={3}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Guard"
        item={4}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Cadet"
        item={5}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Crewman"
        item={4}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Cook"
        item={4}
      />
      <WarehouseTransferItem
        aID={0}
        bID={0}
        interchange={() => undefined}
        aNum={0}
        bNum={0}
        label="Surgeon"
        item={4}
      />
    </Container>
  );
}
