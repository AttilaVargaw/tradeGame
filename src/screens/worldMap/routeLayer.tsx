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
import { GeoJSON as LeafletGeoJSON, tooltip } from "leaflet";
import { GeoJSON } from "react-leaflet";

export type RouteLayerProps = {
  onRouteClick: (ID: number) => void;
};

export const RouteLayer: FC<RouteLayerProps> = ({ onRouteClick }) => {
  // const map = useMap();
  const layerRef = useRef<LeafletGeoJSON>(null);
  const gameState = useContext(GameStateContext);

  const [tradeRoutes, setTradeRoutes] =
    useState<GeoJSON.FeatureCollection<GeoJSON.LineString, TradeRouteProps>>();

  const routeClick = useCallback(
    (ID: number) => () => {
      onRouteClick(ID);
    },
    [onRouteClick]
  );

  const tradeRouteStyle = useMemo(
    () => ({
      color: "grey",
      weight: 8,
      fillColor: "#1a1d62",
      fillOpacity: 1,
      dashArray: "2 10",
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
    <>
      {" "}
      {tradeRoutes && (
        <GeoJSON
          ref={layerRef}
          onEachFeature={({ properties: { ID } }, layer) => {
            layer
              .addEventListener("click", routeClick(ID))
              .setTooltipContent(
                tooltip({ permanent: true, interactive: true })
              )
              .toggleTooltip();
          }}
          pathOptions={tradeRouteStyle}
          data={tradeRoutes}
        />
      )}
    </>
  );
};
