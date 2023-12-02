import CityDataModal from "../modals/CityData/cityDataModal";
import { ConvoyModal } from "../modals/Convoy/convoyModal";
import { ConvoyTradeRouteModal } from "../modals/Convoy/convoyTradeRouteModal";
import VehicleModal from "../modals/Vehicle/vehicleModal";
import { EncyclopediaModal } from "../modals/encyclopedia";
import TradeRouteModal from "../modals/tradeRouteModal";
import { useCurrentModal } from "./hooks/useCurrentModal";

export function ModalRouter(): React.ReactElement | null {
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
