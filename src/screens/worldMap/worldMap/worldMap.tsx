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
import { CRS, Map as LeafletMap } from "leaflet";
import { RouteLayer } from "../routeLayer";
import { CityPositionProperty } from "@Services/GameState/dbTypes";
import { setContextMenuPosition } from "@Services/contextMenu";

import { ImageOverlay, MapContainer } from "react-leaflet";
import { useWindowSize } from "../../../components/hooks/useWIndowSize";
import { ModalRouter } from "@Components/ModalRouter";
import styled from "styled-components";
import { Convoys } from "./convoys";
import { Cities } from "./cities";
import { Vehicles } from "./vehicles";

const Container = styled.div`
  display: "flex";
  flex-direction: "column";
`;

export function WorldMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

  const [citiesGeoJson, setCitiesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  const [vehiclesGeoJson, setVehiclesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  const [convoysGeoJson, setConvoyslesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  useEffect(() => {
    gameState.getCitiesAsGeoJson().then(setCitiesGeoJson);
  }, [gameState]);

  useEffect(() => {
    gameState.getConvoysAsGeoJson().then(setConvoyslesGeoJson);
    gameState.getConvoysAsGeoJson().then(console.log);
  }, [gameState]);

  useEffect(() => {
    gameState.getVehiclesAsGeoJson().then(setVehiclesGeoJson);
  }, [gameState]);

  useEffect(() => {
    /*const keypressHandler = ({ code }: KeyboardEvent) => {
            setTimeout(() => {
                switch (code) {
                    case 'NumpadAdd':
                    case 'NumpadSubtract':
                        break
                    case 'KeyW':
                        break
                    case 'KeyS':
                        break
                    case 'KeyA':
                        break
                    case 'KeyD':
                }
            }, 0);
        }

        window.addEventListener('keypress', keypressHandler)
        return () => window.removeEventListener('keypress', keypressHandler)*/
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
      setContextMenuPosition([clientX, clientY]);
    },
    []
  );

  const { height, width } = useWindowSize();

  const mapContainerRef = useRef<LeafletMap>(null);

  useEffect(() => {
    const eventHandler = () => {
      mapContainerRef.current?.invalidateSize();
    };

    window.addEventListener("resize", eventHandler);

    return () => window.removeEventListener("resize", eventHandler);
  }, []);

  const menuWidth = useMemo(() => `${width * 0.18}px`, [width]);

  return (
    <Container>
      <div
        onContextMenu={onContextMenu}
        style={{ height: height, width: width }}
      >
        <MapContainer
          doubleClickZoom={false}
          scrollWheelZoom
          zoomDelta={2}
          maxBounds={[
            [0, 0],
            [973, 1920],
          ]}
          maxBoundsViscosity={100}
          crs={CRS.Simple}
          style={{
            width: "100%",
            height: "100%",
            background: "#05001f",
          }}
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
            {vehiclesGeoJson && <Vehicles vehiclesGeoJson={vehiclesGeoJson} />}
            {convoysGeoJson && <Convoys convoysGeoJson={convoysGeoJson} />}
            {citiesGeoJson && <Cities citiesGeoJson={citiesGeoJson} />}
          </ImageOverlay>
          <RouteLayer />
        </MapContainer>
      </div>
      <SideMenu
        style={{
          top: 0,
          height: height,
          width: menuWidth,
        }}
      />
      <ModalRouter />
    </Container>
  );
}
