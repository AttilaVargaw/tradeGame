import { GameState } from "@Services/GameState/gameState";
import L, { LatLngExpression, circle, tooltip } from "leaflet";

const tradeRouteStyle = {
  color: "grey",
  weight: 4,
  fillColor: "#1a1d62",
  fillOpacity: 0.5,
  dashArray: "2 10",
};

export function VehiclesLayer() {
  GameState.getVehicleGoalsAsGeoJson().then((vehicles) => {
    vehicleLayer.addData(vehicles);
  });

  const vehicleLayer = L.geoJSON([], {
    pointToLayer: ({ geometry: { coordinates }, properties: { ID, name } }) =>
      circle(coordinates as LatLngExpression, {
        color: "gold",
        radius: 5,
      }).bindTooltip(
        tooltip({
          className: "marker",
          content: name,
          permanent: true,
          direction: "top",
          interactive: true,
          
        })
      ),
  });

  return vehicleLayer;
}
