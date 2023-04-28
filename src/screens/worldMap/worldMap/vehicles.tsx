import { useCurrentVehicle } from "@Components/hooks/useCurrentVehicle";
import { CityPositionProperty, DBEvents } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import L, { LeafletMouseEventHandlerFn } from "leaflet";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Circle,
  Tooltip,
  GeoJSON,
  LayersControl,
  LayerGroup,
} from "react-leaflet";

const tradeRouteStyle = {
  color: "grey",
  weight: 4,
  fillColor: "#1a1d62",
  fillOpacity: 0.5,
  dashArray: "2 10",
};

export function Vehicles() {
  const [currentVehicle, setCurrentVehicle] = useCurrentVehicle();

  const onVehicleClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return (event) => {
        L.DomEvent.stopPropagation(event);
        setCurrentVehicle(ID);
      };
    },
    [setCurrentVehicle]
  );

  const onDoubleClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return (event) => {
        L.DomEvent.stopPropagation(event);
      };
    },
    []
  );

  const gameState = useContext(GameStateContext);

  const [vehiclesGeoJson, setVehiclesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  const [vehicleGoalsGeoJson, setVehicleGoalsGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.LineString>>();

  useEffect(() => {
    gameState.getVehiclesAsGeoJson().then(setVehiclesGeoJson);
    gameState.getVehicleGoalsAsGeoJson().then(setVehicleGoalsGeoJson);
  }, [gameState]);

  useEffect(() => {
    const subscription = gameState.dbObservable.subscribe(({ type }) => {
      switch (type) {
        case DBEvents.vehicleGoalSet:
          setVehicleGoalsGeoJson(undefined);
          gameState.getVehicleGoalsAsGeoJson().then(setVehicleGoalsGeoJson);
          return;
        case DBEvents.newVehicleBought:
        case DBEvents.vehicleJoinedConvoy:
          setVehiclesGeoJson(undefined);
          gameState.getVehiclesAsGeoJson().then(setVehiclesGeoJson);
          return;
      }
    });

    return () => subscription.unsubscribe();
  }, [gameState]);

  useEffect(() => {
    function OutSideClick(this: Window, ev: MouseEvent) {
      if (ev.button === 0 && !ev.ctrlKey) {
        setCurrentVehicle(null);
      }
    }

    window.addEventListener("click", OutSideClick, true);

    return () => window.removeEventListener("click", OutSideClick);
  }, [gameState, setCurrentVehicle]);

  const vehicles = useMemo(() => {
    return vehiclesGeoJson?.features.map(
      ({
        geometry: {
          coordinates: [posX, posY],
        },
        properties: { ID, name },
      }) => {
        const eventHandler = {
          dblclick: onDoubleClick(ID),
          click: onVehicleClick(ID),
        };
        return (
          <Circle
            color={"gold"}
            eventHandlers={eventHandler}
            key={ID}
            center={[posY, posX]}
            radius={5}
          >
            <Tooltip interactive className="marker" direction="top" permanent>
              {name}
            </Tooltip>
            {currentVehicle === ID && (
              <Circle
                eventHandlers={eventHandler}
                pathOptions={{
                  dashOffset: "10",
                  dashArray: "5 10",
                }}
                color={"red"}
                key={ID}
                center={[posY, posX]}
                radius={7}
                interactive
              />
            )}
          </Circle>
        );
      }
    );
  }, [
    currentVehicle,
    onDoubleClick,
    onVehicleClick,
    vehiclesGeoJson?.features,
  ]);

  return (
    <LayersControl.Overlay checked name="Convoys">
      <LayerGroup>
        {vehicles}
        {vehicleGoalsGeoJson && (
          <GeoJSON pathOptions={tradeRouteStyle} data={vehicleGoalsGeoJson} />
        )}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
