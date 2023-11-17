import {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { DBEvents } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import L, { PathOptions, tooltip } from "leaflet";
import { useSelectedRouteAtom } from "@Components/hooks/useSelectedTradeRoute";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";

export type RouteLayerProps = {
  // onRouteClick: (ID: number) => void;
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
  // const map = useMap();
  const gameState = useContext(GameStateContext);

  const [, setSelectedTradeRoute] = useSelectedRouteAtom();
  const [, setCurrentModal] = useCurrentModal();

  const routeClick = useCallback(
    (ID: number) => () => {
      setSelectedTradeRoute(ID);
      setCurrentModal("tradeRoute");
    },
    [setSelectedTradeRoute, setCurrentModal]
  );

  useEffect(() => {
    gameState.getTradeRoutesAsGeoJson().then((tradeRoutes) => {
      routeLayer.current.clearLayers().addData(tradeRoutes);
    });

    return gameState.dbObservable.subscribe(({ type }) => {
      switch (type) {
        case DBEvents.tradeRouteAdded:
        case DBEvents.tradeRouteUpdate:
          gameState.getTradeRoutesAsGeoJson().then((tradeRoutes) => {
            routeLayer.current.clearLayers().addData(tradeRoutes);
          });
          break;
      }
    }).unsubscribe;
  }, [gameState]);

  const routeLayer = useRef(
    L.geoJSON<{ ID: number }>([], {
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
