import { useCurrentModal } from "../hooks/useCurrentModal";
import CityDataModal from "../modals/CityData/cityDataModal";
import { ShippingPlannerRoutesModal } from "../modals/Convoy/ShippingPlannerRoutes/ShippingPlannerRoutesModal";
import { ShippingTransferPlanner } from "../modals/Convoy/ShippingTransferPlanner/ShippingTransferPlanner";
import { ConvoyModal } from "../modals/Convoy/convoyModal";
import { ConvoyTradeRouteModal } from "../modals/Convoy/convoyTradeRouteModal";
import VehicleModal from "../modals/Vehicle/vehicleModal";
import { EncyclopediaModal } from "../modals/encyclopedia";
import TradeRouteModal from "../modals/tradeRouteModal";

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
    case "shippingPlanner":
      return <ShippingTransferPlanner />;
    case "ShippingPlannerRoutes":
      return <ShippingPlannerRoutesModal />;

    default:
      return null;
  }
}
