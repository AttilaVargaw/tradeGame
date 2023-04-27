import { Label } from "@Components/label";
import Modal, { ModalCloseButton } from "../Modal";
import { useCallback, useState } from "react";
import { VehicleListModal } from "./vehicleList";
import { VehicleBuyModal } from "./vehicleBuy";
import { Button } from "@Components/button";

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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Label style={{ flex: 20 }} type="led">{`< ${
            selectedPage === 0 ? "Vehicle list" : "Orders"
          } >`}</Label>
          <div style={{ flex: 1, margin: "0.5em" }}>
            <ModalCloseButton />
          </div>
        </div>
      )}
      body={body}
      footer={() => (
        <div
          style={{
            width: "100%",
            display: "grid",
            flexDirection: "row",
            gridAutoColumns: "1fr",
            gridTemplateColumns: "repeat(5, 1fr)",
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
