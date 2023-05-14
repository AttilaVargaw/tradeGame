import TradeRouteModal from "../modals/tradeRouteModal";
import CityDataModal from "../modals/CityData/cityDataModal";
import { ConvoyModal } from "../modals/Convoy/convoyModal";
import { useCurrentModal } from "./hooks/useCurrentModal";
import VehicleModal from "../modals/Vehicle/vehicleModal";
import { EncyclopediaModal } from "../modals/encyclopedia";
import { ConvoyTradeRouteModal } from "../modals/Convoy/convoyTradeRouteModal";

export function ModalRouter(): JSX.Element | null {
  const [currentModal] = useCurrentModal();

  switch (currentModal) {
    case "cityInfo":
      return <CityDataModal />;
    case "convoys":
      return <ConvoyModal />;
    case "vehicle":
      return <VehicleModal />;
    case "tradeRoute":
      return <TradeRouteModal />;
    case "encyclopedia":
      return <EncyclopediaModal />;
    case "convoyTradeRoute":
      return <ConvoyTradeRouteModal />;
    default:
      return null;
  }
}
