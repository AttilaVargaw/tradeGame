import { useContext, useEffect, useRef } from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import {
  CRS,
  LatLngBoundsExpression,
  LatLngExpression,
  Map,
  svg,
} from "leaflet";
import { RouteLayer } from "../routeLayer";
import { ImageOverlay, LayersControl, MapContainer } from "react-leaflet";
import styled from "styled-components";
import { Convoys } from "./convoys";
import { Cities } from "./cities";
import { Vehicles } from "./vehicles";
import { useKeypressHandler } from "@Components/hooks/useKeypressHandler";
import { useContextMenuHandler } from "@Components/hooks/useContextMenuHandler";

const bounds = [
  [0, 0],
  [1946, 3840],
] as LatLngBoundsExpression;

const maxBounds = [
  [0, 0],
  [1946, 3840],
] as LatLngBoundsExpression;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
  background: #05001f;
`;

const center = [1000, 3300] as LatLngExpression;

export function GameMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

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
  }, [gameState]);

  const renderer = useRef(svg());

  useEffect(() => {}, []);

  return (
    <StyledMapContainer
      center={center}
      zoom={1}
      crs={CRS.Simple}
      preferCanvas
      renderer={renderer.current}
      maxBounds={maxBounds}
      zoomAnimation={false}
      markerZoomAnimation={false}
      boxZoom={false}
    >
      <ImageOverlay url="lava_sea.png" bounds={bounds}>
        <LayersControl position="topright">
          <Vehicles />
          <Convoys />
          <Cities />
          <RouteLayer />
        </LayersControl>
      </ImageOverlay>
    </StyledMapContainer>
  );
}
