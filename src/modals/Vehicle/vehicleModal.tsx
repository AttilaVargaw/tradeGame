import { Label } from "@Components/label";
import styled from "styled-components";
import Modal from "../Modal";
import { useCallback, useState } from "react";
import { VehicleListModal } from "./vehicleList";
import { VehicleBuyModal } from "./vehicleBuy";
import { Button } from "@Components/button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

enum VehicleModalSubPages {
  List,
  Buy,
}

export default function VehicleModal() {
  const [selectedPage, setSelectedPage] = useState(VehicleModalSubPages.List);

  const body = useCallback(() => {
    switch (selectedPage) {
      case VehicleModalSubPages.Buy:
        return <VehicleBuyModal />;
      case VehicleModalSubPages.List:
        return <VehicleListModal />;
    }
  }, [selectedPage]);

  return (
    <Modal
      header={() => (
        <div style={{ paddingLeft: "2em", paddingRight: "2em", width: "100%" }}>
          <Label type="led">{`< Vehicles >`}</Label>
        </div>
      )}
      body={body}
      footer={() => (
        <div
          style={{
            width: "100%",
            margin: "1em",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            active={selectedPage === VehicleModalSubPages.Buy}
            onClick={() => setSelectedPage(VehicleModalSubPages.Buy)}
          >
            Buy
          </Button>
          <Button
            active={selectedPage === VehicleModalSubPages.List}
            onClick={() => setSelectedPage(VehicleModalSubPages.List)}
          >
            List
          </Button>
        </div>
      )}
    />
  );
}
