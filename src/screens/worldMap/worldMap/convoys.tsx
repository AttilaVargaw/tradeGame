import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { RedrawType, gameRedrawSubject } from "@Components/hooks/useGameLoop";
import { GameStateContext } from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import L, { LeafletMouseEvent, LeafletMouseEventHandlerFn } from "leaflet";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Circle,
  LayerGroup,
  LayersControl,
  Tooltip,
  useMap,
} from "react-leaflet";
import { GeoJSON } from "react-leaflet";

const tradeRouteStyle = {
  color: "grey",
  weight: 4,
  fillColor: "#1a1d62",
  fillOpacity: 0.5,
  dashArray: "2 10",
};

const pathOptions = {
  dashOffset: "10",
  dashArray: "3 5",
  fillOpacity: 0.5,
};

export function Convoys() {
  const [, setCurrentModal] = useCurrentModal();
  const [currentConvoy, setCurrentConvoy] = useCurrentConvoy();
  const gameState = useContext(GameStateContext);

  const map = useMap();

  useEffect(() => {
    function OutSideClick(
      this: Window,
      { originalEvent: { button, ctrlKey } }: LeafletMouseEvent
    ) {
      if (button === 0 && !ctrlKey) {
        setCurrentConvoy(null);
      }
    }

    map.addEventListener("click", OutSideClick);

    return () => {
      map.removeEventListener("click", OutSideClick);
    };
  }, [gameState, setCurrentConvoy, map]);

  const goalSetter = useCallback(
    function (this: number, event: LeafletMouseEvent) {
      L.DomEvent.stopPropagation(event);

      const {
        latlng: { lat, lng },
        originalEvent: { button, ctrlKey },
      } = event;

      if (button === 0 && ctrlKey) {
        gameState.setConvoyGoal(this, lng, lat);
      } else {
        map.removeEventListener("click", goalSetter, this);
      }

      return () => map.removeEventListener("click", goalSetter, this);
    },
    [map, gameState]
  );

  const onConvoyClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn =>
      (event: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(event);

        const { button } = event.originalEvent;

        if (button === 0) {
          setCurrentConvoy(ID);

          map.addEventListener("click", goalSetter, ID);

          return () => {
            map.removeEventListener("click", goalSetter, ID);
          };
        }
        return;
      },
    [setCurrentConvoy, map, goalSetter]
  );

  const onDoubleClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return (event) => {
        setCurrentConvoy(ID);
        L.DomEvent.stopPropagation(event);
        setCurrentModal("convoys");
      };
    },
    [setCurrentModal, setCurrentConvoy]
  );

  const [convoysGeoJson, setConvoysGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, ConvoyData>>();

  const [convoyGoalsGeoJson, setConvoyGoalsGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.LineString>>();

  useEffect(() => {
    gameState.getConvoysAsGeoJson().then(setConvoysGeoJson);
    gameState.getConvoyGoalsAsGeoJson().then(setConvoyGoalsGeoJson);
  }, [gameState]);

  useEffect(() => {
    const subscription = gameRedrawSubject.subscribe(async (type) => {
      switch (type) {
        case RedrawType.Convoys:
          window.requestAnimationFrame(async () => {
            setConvoyGoalsGeoJson(undefined);
            setConvoysGeoJson(undefined);
            const goals = await gameState.getConvoyGoalsAsGeoJson();
            const convoys = await gameState.getConvoysAsGeoJson();
            setConvoyGoalsGeoJson(goals);
            setConvoysGeoJson(convoys);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [gameState]);

  const eventHandlers = useCallback(
    (ID: number) => ({
      dblclick: onDoubleClick(ID),
      click: onConvoyClick(ID),
    }),
    [onConvoyClick, onDoubleClick]
  );

  const convoysPointer = useMemo(() => {
    return convoysGeoJson?.features.map(
      ({
        geometry: {
          coordinates: [posX, posY],
        },
        properties: { ID, name },
      }) => {
        const eventHandler = eventHandlers(ID);
        const rPos: [number, number] = [posY, posX];

        return (
          <Circle
            color="red"
            eventHandlers={eventHandler}
            key={ID}
            center={rPos}
            radius={4}
          >
            <Tooltip
              className="marker"
              content={name}
              interactive
              eventHandlers={eventHandler}
              permanent
              direction="top"
            />
            {currentConvoy === ID && (
              <Circle
                eventHandlers={eventHandler}
                pathOptions={pathOptions}
                color="red"
                key={ID}
                center={rPos}
                radius={6}
              />
            )}
          </Circle>
        );
      }
    );
  }, [convoysGeoJson?.features, currentConvoy, eventHandlers]);

  return (
    <LayersControl.Overlay checked name="Convoys">
      <LayerGroup>
        {convoyGoalsGeoJson && (
          <GeoJSON
            onEachFeature={({ properties: { ID } }, layer) => {
              layer.addEventListener(eventHandlers(ID));
            }}
            pathOptions={tradeRouteStyle}
            data={convoyGoalsGeoJson}
          />
        )}
        {convoysPointer}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
