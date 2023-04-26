import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import {
  RedrawType,
  gameRedrawSubject,
  useGameLoop,
} from "@Components/hooks/useGameLoop";
import { GameStateContext } from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { LeafletMouseEventHandlerFn } from "leaflet";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Circle, Tooltip } from "react-leaflet";
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

  const onConvoyClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return () => {
        setCurrentConvoy(ID);
        console.log("clicked");
      };
    },
    [setCurrentConvoy]
  );

  const onDoubleClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return () => {
        setCurrentConvoy(ID);
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
    const subscription = gameRedrawSubject.subscribe((type) => {
      switch (type) {
        case RedrawType.Convoys:
          setConvoyGoalsGeoJson(undefined);
          setConvoysGeoJson(undefined);

          gameState.getConvoyGoalsAsGeoJson().then(setConvoyGoalsGeoJson);
          gameState.getConvoysAsGeoJson().then(setConvoysGeoJson);
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
            <Tooltip eventHandlers={eventHandler} permanent direction="left">
              {name}
            </Tooltip>
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
    <>
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
    </>
  );
}
