import { Label } from "@Components/label";
import Modal from "../Modal";
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
        <Label type="led">{`< ${
          selectedPage === 0 ? "Vehicle list" : "Orders"
        } >`}</Label>
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
