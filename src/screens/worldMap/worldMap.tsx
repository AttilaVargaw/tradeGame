import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CityDataModal from "../../modals/cityDataModal";
import { SelectedCityContext } from "./selectedCityContext";
import { GameStateContext } from "Services/GameState/gameState";
import SideMenu, { ButtonLikeDisplay } from "./sideMenu";
import { CRS, LeafletMouseEventHandlerFn, Map as LeafletMap } from "leaflet";
import { RouteLayer } from "./routeLayer";
import { CityPositionProperty } from "Services/GameState/dbTypes";
import { addToContextMenu, setContextMenuPosition } from "Services/contextMenu";
import { SelectedTradeRouteContext } from "./selectedTradeRouteContext";
import TradeRouteModal from "../../modals/tradeRouteModal";
import { ConvoyModal } from "../../modals/convoysModal";
import { VehicleBuyModal } from "../../modals/vehicleBuyModal";
import { TopMenu } from "../../components/topMenu";
import { Circle, ImageOverlay, MapContainer, Tooltip } from "react-leaflet";
import { useWindowSize } from "../../components/hooks/useWIndowSize";
import styled from "styled-components";

export const CityColors: { [key: string]: string } = {
  Mine: "black",
  Metropolis: "blue",
  MiningTown: "red",
  MiningColony: "yellow",
  MilitaryBase: "white",
  ResearchStation: "grey",
  RandomEncounter: "gold",
};

export function WorldMap(): JSX.Element {
  const gameState = useContext(GameStateContext);

  const [currentCity, setCurrentCity] = useState<number | null>(null);
  const [currentTradeRoute, setCurrentTradeRoute] = useState<number | null>(
    null
  );
  const [citiesGeoJson, setCitiesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();
  const [selectedCities, setSelectedCities] = useState<(number | null)[]>([
    null,
    null,
  ]);
  const [showConvoyModal, setShowConvoyModal] = useState(false);
  const [showVehicleBuyModal, setShowVehicleBuyModal] = useState(false);

  useEffect(() => {
    gameState.getCitiesAsGeoJson().then(setCitiesGeoJson);
  }, [gameState]);

  useEffect(() => {
    const onClick = () => {
      const [cityA, cityB] = selectedCities;

      if (cityA && cityB) {
        gameState.addTradeRoute(selectedCities);
        setContextMenuPosition(null);
      }
    };

    return addToContextMenu({ disabled: false, labelKey: "addRoute", onClick });
  }, [selectedCities, gameState]);

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

    document.addEventListener(
      "contextmenu",
      contextMenuHandler
      // { capture: true }
    );

    return () =>
      document.removeEventListener("contextmenu", contextMenuHandler);
  }, []);

  const onDoubleClick = useCallback(
    (city: number): LeafletMouseEventHandlerFn =>
      () => {
        const cityID: number | undefined = citiesGeoJson?.features.find(
          ({ properties: { ID } }) => ID === city
        )?.properties.ID;

        if (cityID) {
          setCurrentCity(cityID);
        }
      },
    [citiesGeoJson]
  );

  const onCityClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn =>
      () => {
        setSelectedCities((s) => [s[1], ID]);
      },
    []
  );

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

  const menuHeight = useMemo(() => `${height * 0.1}px`, [height]);

  const menuWidth = useMemo(() => `${width * 0.15}px`, [width]);

  const mapWidth = useMemo(() => `${width * 0.9}px`, [width]);

  const mapHeight = useMemo(() => `${height * 0.9}px`, [height]);

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const timeout = setInterval(() => {
      const time = new Date(
        new Date().setFullYear(1899, 1, 1) - new Date(2020).valueOf()
      );
      setTime(time.toLocaleTimeString());
      setDate(time.toLocaleDateString());
    }, 1000);

    return () => clearInterval(timeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {currentCity && (
        <SelectedCityContext.Provider value={currentCity}>
          <CityDataModal
            isOpen={!!currentCity}
            onRequestClose={() => setCurrentCity(null)}
          />
        </SelectedCityContext.Provider>
      )}
      <ConvoyModal
        isOpen={showConvoyModal}
        onRequestClose={() => {
          setShowConvoyModal(false);
        }}
      />
      <VehicleBuyModal
        isOpen={showVehicleBuyModal}
        onRequestClose={() => {
          setShowVehicleBuyModal(false);
        }}
      />

      {/*<TopMenu height={menuHeight} />*/}

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
            {citiesGeoJson &&
              citiesGeoJson.features.map(
                ({
                  geometry: {
                    coordinates: [posX, posY],
                  },
                  properties: { ID, name, type },
                }) => {
                  return (
                    <Circle
                      color={CityColors[type]}
                      eventHandlers={{
                        dblclick: onDoubleClick(ID),
                        click: onCityClick(ID),
                      }}
                      key={ID}
                      center={[posY, posX]}
                      radius={8}
                    >
                      <Tooltip permanent>
                        {type !== "RandomEncounter" ? name : "Random Encounter"}
                      </Tooltip>
                      {(selectedCities[0] === ID ||
                        selectedCities[1] === ID) && (
                        <Circle
                          eventHandlers={{ dblclick: onDoubleClick(ID) }}
                          pathOptions={{
                            dashOffset: "10",
                            dashArray: "5 10",
                          }}
                          color={CityColors[type]}
                          key={ID}
                          center={[posY, posX]}
                          radius={10}
                        />
                      )}
                    </Circle>
                  );
                }
              )}
          </ImageOverlay>
          <SelectedTradeRouteContext.Provider value={currentTradeRoute}>
            <RouteLayer onRouteClick={setCurrentTradeRoute} />
            <TradeRouteModal
              onRequestClose={() => setCurrentTradeRoute(null)}
              isOpen={!!currentTradeRoute}
            />
          </SelectedTradeRouteContext.Provider>
        </MapContainer>
      </div>
      <SideMenu
        style={{
          top: 0,
          height: height,
          width: menuWidth,
        }}
      >
        <ButtonLikeDisplay black>
          {date} {time}
        </ButtonLikeDisplay>
        <ButtonLikeDisplay black>5556.22ℳ</ButtonLikeDisplay>
        <ButtonLikeDisplay onClick={() => setShowConvoyModal(true)}>
          Convoys
        </ButtonLikeDisplay>
        <ButtonLikeDisplay
          onClick={() => {
            setShowVehicleBuyModal(true);
          }}
        >
          New Vehicle
        </ButtonLikeDisplay>
      </SideMenu>
    </div>
  );
}
