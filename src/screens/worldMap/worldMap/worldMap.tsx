import { useContext, useEffect, useMemo, useRef } from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import SideMenu from "../sideMenu";
import L, {
  CRS,
  LatLngBoundsExpression,
  LatLngExpression,
  Map as LeafletMap,
  LeafletMouseEvent,
} from "leaflet";
import { RouteLayer } from "../routeLayer";
import { ImageOverlay, LayersControl, MapContainer } from "react-leaflet";
import { useWindowSize } from "../../../components/hooks/useWIndowSize";
import { ModalRouter } from "@Components/ModalRouter";
import styled from "styled-components";
import { Convoys } from "./convoys";
import { Cities } from "./cities";
import { Vehicles } from "./vehicles";
import { useGameLoop } from "@Components/hooks/useGameLoop";
import { useKeypressHandler } from "@Components/hooks/useKeypressHandler";
import { useContextMenuHandler } from "@Components/hooks/useContextMenuHandler";
import { ContextMenuPosition } from "@Components/hooks/useContextMenuPosition";

const Container = styled.div`
  display: "flex";
  flex-direction: "column";
`;

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

const PageContainer = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

export function WorldMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

  useKeypressHandler();
  useContextMenuHandler();
  useGameLoop();

  const mapContainerRef = useRef<LeafletMap>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const { height, width } = useWindowSize();
  const mapContainerCleanUpRef = useRef<LeafletMap>();

  useEffect(() => {
    function ResizeHandler() {
      mapContainerRef.current?.invalidateSize();
    }

    window.addEventListener("resize", ResizeHandler);

    mapContainerCleanUpRef.current = mapContainerRef.current!;

    function ContextMenuHanlder({
      originalEvent: { clientX, clientY },
    }: LeafletMouseEvent) {
      ContextMenuPosition.next([clientX, clientY]);
    }

    mapContainerRef.current?.addEventListener(
      "contextmenu",
      ContextMenuHanlder
    );

    return () => {
      mapContainerRef.current?.removeEventListener(
        "contextmenu",
        ContextMenuHanlder
      );
      window.removeEventListener("resize", ResizeHandler);
    };
  }, [gameState]);

  const menuWidth = useMemo(() => `${width * 0.18}px`, [width]);
  const mapWidth = useMemo(() => width * 0.82, [width]);

  const sideMenuStyle = useMemo(
    () => ({ height: height, width: menuWidth, top: 0 }),
    [menuWidth, height]
  );

  const renderer = useRef(L.canvas());

  return (
    <Container>
      <PageContainer height={height} width={mapWidth}>
        <StyledMapContainer
          doubleClickZoom={false}
          scrollWheelZoom
          zoomDelta={1}
          maxBounds={maxBounds}
          maxBoundsViscosity={100}
          crs={CRS.Simple}
          center={center}
          zoom={1}
          minZoom={1}
          ref={mapContainerRef}
          dragging={true}
          renderer={renderer.current}
          boxZoom={false}
          keyboardPanDelta={100}
          preferCanvas
          easeLinearity={1}
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
      </PageContainer>
      <SideMenu ref={sideMenuRef} style={sideMenuStyle} />
      <ModalRouter />
    </Container>
  );
}
