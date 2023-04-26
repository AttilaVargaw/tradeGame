import React, {
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
import { useTickUpdater } from "@Components/hooks/useTick";

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

let oldTimeStamp = 0;

export function WorldMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

  const [, setCurrentSelectedCities] = useCurrentSelectedCities();
  const [currentVehicle, setCurrentVehicle] = useCurrentVehicle();

  useTickUpdater();

  const [currentConvoy, setCurrentConvoy] = useCurrentConvoy();

  const [, setContextMenuPosition] = useContextMenuPosition();

  const gameLoopAnimationFrame = useRef<number>();

  useEffect(() => {
    async function gameLoop(timeStamp: number) {
      const secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      oldTimeStamp = timeStamp;

      await gameState.UpdateConvoys(secondsPassed);

      document.getElementById("FPS")!.innerHTML = Math.round(
        1 / secondsPassed
      ).toString();

      gameLoopAnimationFrame.current = window.requestAnimationFrame(gameLoop);

      return () =>
        gameLoopAnimationFrame.current &&
        window.cancelAnimationFrame(gameLoopAnimationFrame.current);
    }

    window.requestAnimationFrame(gameLoop);
  }, [gameState]);

  useEffect(() => {
    const keypressHandler = ({ code }: KeyboardEvent) => {
      setTimeout(() => {
        switch (code) {
          case "NumpadAdd":
          case "NumpadSubtract":
            break;
          case "KeyW":
            break;
          case "KeyS":
            break;
          case "KeyA":
            break;
          case "KeyD":
            break;
        }
      }, 0);
    };

    window.addEventListener("keypress", keypressHandler);
    return () => window.removeEventListener("keypress", keypressHandler);
  });

  useEffect(() => {
    const contextMenuHandler: EventListenerOrEventListenerObject = function (
      event
    ) {
      // alert("You've tried to open context menu"); //here you draw your own menu
      event.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", contextMenuHandler, {
      capture: true,
    });

    return () =>
      document.removeEventListener("contextmenu", contextMenuHandler);
  }, []);

  const onContextMenu = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    ({ nativeEvent: { clientX, clientY } }) => {
      if (!currentConvoy && !currentVehicle) {
        setContextMenuPosition([clientX, clientY]);
      }
    },
    [currentConvoy, currentVehicle, setContextMenuPosition]
  );

  const { height, width } = useWindowSize();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<LeafletMap>(null);

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

  const mapContainerCleanUpRef = useRef<LeafletMap>();

  useEffect(() => {
    function ClickHandler(
      this: Window,
      { originalEvent: ev, latlng: { lat, lng } }: LeafletMouseEvent
    ) {
      if (ev.button === 0 && ev.ctrlKey) {
        if (currentConvoy) {
          gameState.setConvoyGoal(currentConvoy, lng, lat);
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
          zoomDelta={2}
          maxBounds={maxBounds}
          maxBoundsViscosity={100}
          crs={CRS.Simple}
          center={center}
          zoom={1}
          minZoom={1}
          ref={mapContainerRef}
          zoomAnimation={false}
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
