import {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
import { ImageOverlay, MapContainer } from "react-leaflet";
import { useWindowSize } from "../../../components/hooks/useWIndowSize";
import { ModalRouter } from "@Components/ModalRouter";
import styled from "styled-components";
import { Convoys } from "./convoys";
import { Cities } from "./cities";
import { Vehicles } from "./vehicles";
import { useCurrentSelectedCities } from "@Components/hooks/useSelectedCities";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentVehicle } from "@Components/hooks/useCurrentVehicle";
import { useContextMenuPosition } from "@Components/hooks/useContextMenuPosition";
import { useGameLoop } from "@Components/hooks/useGameLoop";
import { useKeypressHandler } from "@Components/hooks/useKeypressHandler";
import { useContextMenuHandler } from "@Components/hooks/useContextMenuHandler";
import { useTickUpdate } from "@Components/hooks/useTick";

const Container = styled.div`
  display: "flex";
  flex-direction: "column";
`;

const bounds = [
  [0, 0],
  [973, 1920],
] as LatLngBoundsExpression;

const maxBounds = [
  [0, 0],
  [973, 1920],
] as LatLngBoundsExpression;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
  background: #05001f;
`;

const center = [500, 1650] as LatLngExpression;

const PageContainer = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

export function WorldMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

  const [, setCurrentSelectedCities] = useCurrentSelectedCities();
  const [currentVehicle, setCurrentVehicle] = useCurrentVehicle();
  const [currentConvoy, setCurrentConvoy] = useCurrentConvoy();
  const [, setContextMenuPosition] = useContextMenuPosition();

  useKeypressHandler();
  useContextMenuHandler();
  useGameLoop();
  useTickUpdate();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<LeafletMap>(null);
  const { height, width } = useWindowSize();
  const mapContainerCleanUpRef = useRef<LeafletMap>();

  const onContextMenu = useCallback<MouseEventHandler<HTMLDivElement>>(
    ({ nativeEvent: { clientX, clientY } }) => {
      if (!currentConvoy && !currentVehicle) {
        setContextMenuPosition([clientX, clientY]);
      }
    },
    [currentConvoy, currentVehicle, setContextMenuPosition]
  );

  useEffect(() => {
    function OutSideClick(this: Window, ev: MouseEvent) {
      if (
        ev.button === 0 &&
        !ev.ctrlKey &&
        !containerRef.current?.contains(ev.target as Node)
      ) {
        if (!ev.shiftKey) {
          setCurrentSelectedCities([null, null]);
        }
        setCurrentConvoy(null);
        setCurrentVehicle(null);
      }
    }

    window.addEventListener("click", OutSideClick, true);

    return () => window.removeEventListener("click", OutSideClick);
  }, [
    setCurrentSelectedCities,
    setCurrentConvoy,
    currentConvoy,
    gameState,
    setCurrentVehicle,
  ]);

  useEffect(() => {
    function ClickHandler(
      this: Window,
      { originalEvent: ev, latlng: { lat, lng } }: LeafletMouseEvent
    ) {
      if (ev.button === 0 && ev.ctrlKey) {
        if (currentConvoy) {
          gameState.setConvoyGoal(
            currentConvoy,
            Math.round(lng),
            Math.round(lat)
          );
        } else if (currentVehicle) {
          gameState.setVehicleGoal(currentVehicle, lng, lat);
        }
      }
    }

    function ResizeHandler() {
      mapContainerRef.current?.invalidateSize();
    }

    window.addEventListener("resize", ResizeHandler);

    mapContainerRef.current?.on("click", ClickHandler);

    mapContainerCleanUpRef.current = mapContainerRef.current!;

    return () => {
      mapContainerCleanUpRef.current?.off("click", ClickHandler);
      window.removeEventListener("resize", ResizeHandler);
    };
  }, [currentConvoy, gameState, currentVehicle]);

  const menuWidth = useMemo(() => `${width * 0.18}px`, [width]);
  const mapWidth = useMemo(() => width * 0.82, [width]);

  const sideMenuStyle = useMemo(
    () => ({ height: height, width: menuWidth, top: 0 }),
    [menuWidth, height]
  );

  const renderer = useRef(L.canvas());

  console.log("renderer");

  return (
    <Container>
      <PageContainer
        height={height}
        width={mapWidth}
        onContextMenu={onContextMenu}
      >
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
          zoomAnimation={false}
          fadeAnimation={false}
          markerZoomAnimation={false}
          renderer={renderer.current}
        >
          <ImageOverlay url="lava_sea.png" bounds={bounds}>
            <Vehicles />
            <Convoys />
            <Cities />
          </ImageOverlay>
          <RouteLayer />
        </StyledMapContainer>
      </PageContainer>
      <SideMenu style={sideMenuStyle} />
      <ModalRouter />
    </Container>
  );
}
