import L, {
  CRS,
  LatLngBoundsExpression,
  LatLngExpression,
  Map,
  canvas,
} from "leaflet";
import { useEffect, useRef } from "react";
import styled from "styled-components";

import { useContextMenuHandler } from "@Components/hooks/useContextMenuHandler";
import { currentConvoySubject } from "@Components/hooks/useCurrentConvoy";
import { useKeypressHandler } from "@Components/hooks/useKeypressHandler";
import { currentCitiesObservable } from "@Components/hooks/useSelectedCities";
import { setConvoyGoal } from "@Services/GameState/tables/Convoy/convoyQueries";

import { currentSideMenuBehaviorSubject } from "../../SideMenu/currentSideMenu";
import { useTradeRoutes } from "../routeLayer";
import { useCitites } from "./cities";
import { useConvoyLayer } from "./convoys";
import { VehiclesLayer } from "./vehicles";

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
          vehicleLayer.vehicleLayer,
          background,
          cityLayer.current,
          tradeRoutes.current,
        ],
        doubleClickZoom: false,
      })
        .addEventListener("click", () => {
          currentCitiesObservable.next([null, null]);
          currentConvoySubject.next(null);
          currentSideMenuBehaviorSubject.next("default");
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
            vehicles: vehicleLayer.vehicleLayer,
            convoys: convoyLayer.current,
            tradeRoutes: tradeRoutes.current,
          },
          { hideSingleBase: false }
        )
        .addTo(mapInstance.current);

    return () => vehicleLayer.destructor();
  }, [cityLayer, convoyLayer, tradeRoutes]);

  return <StyledMapContainer ref={map} />;
}
