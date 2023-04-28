import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DBEvents, TradeRouteProps } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import { GeoJSON as LeafletGeoJSON, PathOptions, tooltip } from "leaflet";
import { GeoJSON, LayerGroup, LayersControl } from "react-leaflet";
import { useSelectedRouteAtom } from "@Components/hooks/useSelectedTradeRoute";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";

export type RouteLayerProps = {
  // onRouteClick: (ID: number) => void;
};

export const RouteLayer: FC<RouteLayerProps> = () => {
  // const map = useMap();
  const layerRef = useRef<LeafletGeoJSON>(null);
  const gameState = useContext(GameStateContext);

  const [, setSelectedTradeRoute] = useSelectedRouteAtom();
  const [, setCurrentModal] = useCurrentModal();

  const [tradeRoutes, setTradeRoutes] =
    useState<GeoJSON.FeatureCollection<GeoJSON.LineString, TradeRouteProps>>();

  const routeClick = useCallback(
    (ID: number) => () => {
      setSelectedTradeRoute(ID);
      setCurrentModal("tradeRoute");
    },
    [setSelectedTradeRoute, setCurrentModal]
  );

  const tradeRouteStyle = useMemo<PathOptions>(
    () => ({
      color: "greenyellow",
      weight: 5,
      fillColor: "greenyellow",
      fillOpacity: 1,
      lineCap: "square",
      opacity: 0.5,
      dashArray: [2, 10],
    }),
    []
  );

  useEffect(() => {
    return gameState.dbObservable.subscribe(({ type }) => {
      if (type === DBEvents.tradeRouteUpdate) {
        setTradeRoutes(undefined);
        gameState.getTradeRoutesAsGeoJson().then((tradeRoutes) => {
          setTradeRoutes(tradeRoutes);
        });
      }
    }).unsubscribe;
  }, [gameState]);

  return (
    <LayersControl.Overlay name="Routes">
      <LayerGroup>
        {tradeRoutes && (
          <GeoJSON
            ref={layerRef}
            onEachFeature={({ properties: { ID } }, layer) => {
              layer
                .addEventListener("click", routeClick(ID))
                .setTooltipContent(
                  tooltip({
                    permanent: true,
                    interactive: true,
                    className: "marker",
                    direction: "top",
                  })
                )
                .toggleTooltip();
            }}
            pathOptions={tradeRouteStyle}
            data={tradeRoutes}
          />
        )}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};
