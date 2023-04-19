import TradeRouteModal from "../modals/tradeRouteModal";
import CityDataModal from "../modals/CityData/cityDataModal";
import { ConvoyModal } from "../modals/convoysModal";
import { VehicleBuyModal } from "../modals/vehicleBuyModal";
import { useCurrentModal } from "./hooks/useCurrentModal";
import { useCallback } from "react";

export function ModalRouter() {
  const [currentModal, setCurrentModal] = useCurrentModal();

  const closeModal = useCallback(() => {
    setCurrentModal(null);
  }, [setCurrentModal]);

  return (
    <>
      <CityDataModal
        isOpen={currentModal === "cityInfo"}
        onRequestClose={closeModal}
      />
      <ConvoyModal
        isOpen={currentModal === "convoys"}
        onRequestClose={closeModal}
      />
      <VehicleBuyModal
        isOpen={currentModal === "buyVehicle"}
        onRequestClose={closeModal}
      />
      <TradeRouteModal
        isOpen={currentModal === "tradeRoute"}
        onRequestClose={closeModal}
      />
    </>
  );
}
