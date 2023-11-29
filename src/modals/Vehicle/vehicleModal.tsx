import { useMemo, useState } from "react";
import styled from "styled-components";

import { Button } from "@Components/button";
import { Grid } from "@Components/grid";
import { Label } from "@Components/label";

import Modal, { ModalCloseButton } from "../Modal";
import { VehicleBuyModal } from "./vehicleBuy";
import { VehicleListModal } from "./vehicleList";

enum VehicleModalSubPages {
  List,
  Buy,
}

const Container = styled.div``;

export default function VehicleModal() {
  const [selectedPage, setSelectedPage] = useState(VehicleModalSubPages.List);

  const body = useMemo(() => {
    switch (selectedPage) {
      case VehicleModalSubPages.Buy:
        return <VehicleBuyModal />;
      case VehicleModalSubPages.List:
        return <VehicleListModal />;
    }
  }, [selectedPage]);

  return (
    <Modal
      header={useMemo(
        () => (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Label style={{ flex: 20 }} type="led">{`< ${
              selectedPage === 0 ? "Vehicle list" : "Orders"
            } >`}</Label>
          </div>
        ),
        [selectedPage]
      )}
      body={body}
      footer={useMemo(
        () => (
          <Grid $num={2}>
            <Button
              $active={selectedPage === VehicleModalSubPages.Buy}
              onClick={() => setSelectedPage(VehicleModalSubPages.Buy)}
            >
              Buy
            </Button>
            <Button
              $active={selectedPage === VehicleModalSubPages.List}
              onClick={() => setSelectedPage(VehicleModalSubPages.List)}
            >
              List
            </Button>
          </Grid>
        ),
        [selectedPage]
      )}
    />
  );
}
