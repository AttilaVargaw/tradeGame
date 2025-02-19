import L, { PathOptions, tooltip } from "leaflet";
import { useEffect, useRef } from "react";

import { useCurrentModal } from "@Hooks/index";
import { useSelectedRouteAtom } from "@Hooks/useSelectedTradeRoute";
import { DBEvents } from "@Services/GameState/dbTypes";
import { dbObservable } from "@Services/GameState/gameState";
import { getTradeRoutesAsGeoJson } from "@Services/GameState/queries/tradeRoute";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

export type RouteLayerProps = {
  // onRouteClick: (ID: ID) => void;
};

const tradeRouteStyle: PathOptions = {
  color: "greenyellow",
  weight: 5,
  fillColor: "greenyellow",
  fillOpacity: 1,
  lineCap: "square",
  opacity: 0.5,
  dashArray: [2, 10],
};

export function useTradeRoutes() {
  const [, setSelectedTradeRoute] = useSelectedRouteAtom();
  const [, setCurrentModal] = useCurrentModal();

  const routeClick = (ID: ID) => () => {
    setSelectedTradeRoute(ID);
    setCurrentModal("tradeRoute");
  };

  useEffect(() => {
    getTradeRoutesAsGeoJson().then((tradeRoutes) => {
      routeLayer.current.clearLayers().addData(tradeRoutes);
    });

    return dbObservable.subscribe(({ type }) => {
      switch (type) {
        case DBEvents.tradeRouteAdded:
        case DBEvents.tradeRouteUpdate:
          getTradeRoutesAsGeoJson().then((tradeRoutes) => {
            routeLayer.current.clearLayers().addData(tradeRoutes);
          });
          break;
      }
    }).unsubscribe;
  }, []);

  const routeLayer = useRef(
    L.geoJSON<{ ID: ID }>([], {
      style: tradeRouteStyle,
      onEachFeature: ({ properties: { ID } }, layer) => {
        layer
          .addEventListener("dblclick", routeClick(ID))
          .setTooltipContent(
            tooltip({
              permanent: true,
              interactive: true,
              className: "marker",
              direction: "top",
            })
          )
          .toggleTooltip();
      },
    })
  );

  return routeLayer;
}
