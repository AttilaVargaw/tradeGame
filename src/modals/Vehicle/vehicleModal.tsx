import { useState } from "react";

import { Label } from "@Components/label";
import { TogglePager } from "@Components/togglePager";

import Modal from "../Modal";
import { VehicleBuyModal } from "./vehicleBuy";
import { VehicleListModal } from "./vehicleList";

enum Subpages {
  List,
  Buy,
}

const pages = [
  {
    label: "Crew",
    value: Subpages.Buy,
  },
  {
    label: "Vehicles",
    value: Subpages.List,
  },
];

export default function VehicleModal() {
  const [selectedPage, setSelectedPage] = useState(Subpages.List);

  const body = (() => {
    switch (selectedPage) {
      case Subpages.Buy:
        return <VehicleBuyModal />;
      case Subpages.List:
        return <VehicleListModal />;
    }
  })();

  return (
    <Modal
      header={
        <Label type="painted">
          {selectedPage === 0 ? "Vehicle list" : "Orders"}
        </Label>
      }
      body={body}
      footer={
        <TogglePager
          selected={selectedPage}
          onChange={setSelectedPage}
          values={pages}
        />
      }
    />
  );
}
