import L, { LatLngExpression, circle, tooltip } from "leaflet";

import { RedrawType, gameRedrawSubject } from "@Hooks/index";
import { getConvoylessVehiclesAsGeoJSON } from "@Services/GameState/tables/Convoy/convoyQueries";
import { getVehicleGoalsAsGeoJson } from "@Services/GameState/tables/Vehicle/vehiclesQueries";

const tradeRouteStyle = {
  color: "grey",
  weight: 4,
  fillColor: "#1a1d62",
  fillOpacity: 0.5,
  dashArray: "2 10",
};

export function VehiclesLayer() {
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

  function update() {
    vehicleLayer.clearLayers();

    getVehicleGoalsAsGeoJson().then((vehicles) => {
      vehicleLayer.addData(vehicles);
    });
    getConvoylessVehiclesAsGeoJSON().then((vehicles) => {
      vehicleLayer.addData(vehicles);
    });
  }

  const redrawSubscription = gameRedrawSubject.subscribe((event) => {
    switch (event) {
      case RedrawType.Vehicles:
        update();
    }
  });

  update();

  return { destructor: () => redrawSubscription.unsubscribe(), vehicleLayer };
}
