import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import SideMenu from "../sideMenu";
import { CRS, Map as LeafletMap, LeafletMouseEvent } from "leaflet";
import { RouteLayer } from "../routeLayer";
import { CityPositionProperty } from "@Services/GameState/dbTypes";

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
import { useTick, useTickUpdater } from "@Components/hooks/useTick";

const Container = styled.div`
  display: "flex";
  flex-direction: "column";
`;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
  background: #05001f;
`;

export function WorldMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

  const [, setCurrentSelectedCities] = useCurrentSelectedCities();
  const [currentVehicle, setCurrentVehicle] = useCurrentVehicle();

  useTickUpdater();

  const [currentConvoy, setCurrentConvoy] = useCurrentConvoy();

  const [citiesGeoJson, setCitiesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  const [, setContextMenuPosition] = useContextMenuPosition();

  useEffect(() => {
    gameState.getCitiesAsGeoJson().then(setCitiesGeoJson);
  }, [gameState]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      gameState.UpdateConvoys(1);
    }, 1000);

    return () => clearInterval(updateInterval);
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

    return () => {
      mapContainerRef.current?.off("click", ClickHandler);
      window.removeEventListener("resize", ResizeHandler);
    };
  }, [currentConvoy, gameState, currentVehicle]);

  const menuWidth = useMemo(() => `${width * 0.18}px`, [width]);

  const sideMenuStyle = useMemo(
    () => ({ height: height, width: menuWidth, top: 0 }),
    [menuWidth, height]
  );

  return (
    <Container>
      <div onContextMenu={onContextMenu} style={{ height, width }}>
        <StyledMapContainer
          doubleClickZoom={false}
          scrollWheelZoom
          zoomDelta={2}
          maxBounds={[
            [0, 0],
            [973, 1920],
          ]}
          maxBoundsViscosity={100}
          crs={CRS.Simple}
          center={[500, 1650]}
          zoom={1}
          minZoom={1}
          ref={mapContainerRef}
        >
          <ImageOverlay
            url="lava_sea.png"
            bounds={[
              [0, 0],
              [973, 1920],
            ]}
          >
            <Vehicles />
            <Convoys />
            {citiesGeoJson && <Cities citiesGeoJson={citiesGeoJson} />}
          </ImageOverlay>
          <RouteLayer />
        </StyledMapContainer>
      </div>
      <SideMenu style={sideMenuStyle} />
      <ModalRouter />
    </Container>
  );
}
