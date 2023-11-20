import { useEffect, useRef } from "react";
import {
  getConvoysAsGeoJson,
  setConvoyGoal,
} from "@Services/GameState/gameState";
import L, {
  CRS,
  LatLngBoundsExpression,
  LatLngExpression,
  Map,
  canvas,
} from "leaflet";
import styled from "styled-components";
import { useKeypressHandler } from "@Components/hooks/useKeypressHandler";
import { useContextMenuHandler } from "@Components/hooks/useContextMenuHandler";
import { useConvoyLayer } from "./convoys";
import { VehiclesLayer } from "./vehicles";
import { useCitites } from "./cities";
import { useTradeRoutes } from "../routeLayer";
import { currentCitiesObservable } from "@Components/hooks/useSelectedCities";
import { currentConvoySubject } from "@Components/hooks/useCurrentConvoy";

const bounds = [
  [0, 0],
  [1946, 3840],
] as LatLngBoundsExpression;

const StyledMapContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #05001f;
`;

const center = [1000, 3300] as LatLngExpression;

export function GameMap(): JSX.Element {
  useKeypressHandler();
  useContextMenuHandler();

  const mapContainerRef = useRef<Map>(null);

  useEffect(() => {
    function ResizeHandler() {
      mapContainerRef.current?.invalidateSize();
    }

    return () => {
      window.removeEventListener("resize", ResizeHandler);
    };
  }, []);

  const renderer = useRef(canvas());

  const map = useRef<HTMLDivElement>(null);

  const mapInstance = useRef<L.Map | null>(null);

  const convoyLayer = useConvoyLayer();

  const cityLayer = useCitites();

  const tradeRoutes = useTradeRoutes();

  useEffect(() => {
    const vehicleLayer = VehiclesLayer();
    const background = L.imageOverlay("lava_sea.png", bounds);

    if (map.current) {
      mapInstance.current = L.map(map.current, {
        renderer: renderer.current,
        center,
        zoom: 1,
        maxBounds: bounds,
        zoomAnimation: false,
        boxZoom: false,
        markerZoomAnimation: false,
        crs: CRS.Simple,
        layers: [
          convoyLayer.current,
          background,
          cityLayer.current,
          vehicleLayer,
          tradeRoutes.current,
        ],
        doubleClickZoom: false,
      })
        .addEventListener("click", () => {
          currentCitiesObservable.next([null, null]);
          currentConvoySubject.next(null);
        })
        .addEventListener("contextmenu", ({ latlng: { lat, lng } }) => {
          if (currentConvoySubject.value) {
            setConvoyGoal(currentConvoySubject.value, lat, lng);
          }
        });
    } else {
      console.error("The map element is missing!");
    }

    mapInstance.current &&
      L.control
        .layers(
          {
            base: background,
          },
          {
            cities: cityLayer.current,
            vehicles: vehicleLayer,
            convoys: convoyLayer.current,
            tradeRoutes: tradeRoutes.current,
          },
          { hideSingleBase: false }
        )
        .addTo(mapInstance.current);
  }, [cityLayer, convoyLayer, tradeRoutes]);

  useEffect(() => {
    getConvoysAsGeoJson().then((convoys) => {
      convoyLayer.current.addData(convoys);
    });
  }, [convoyLayer]);

  return <StyledMapContainer ref={map} />;
}
