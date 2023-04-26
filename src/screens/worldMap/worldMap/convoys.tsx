import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { DBEvents } from "@Services/GameState/dbTypes";
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
    const subscription = gameState.dbObservable.subscribe(({ type }) => {
      switch (type) {
        case DBEvents.convoyGoalSet:
        case DBEvents.convoyUpdated:
        case DBEvents.newConvoyCreated:
        case DBEvents.vehicleJoinedConvoy:
          setConvoyGoalsGeoJson(undefined);
          gameState.getConvoyGoalsAsGeoJson().then(setConvoyGoalsGeoJson);

          setConvoysGeoJson(undefined);
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

        return (
          <Circle
            color="red"
            eventHandlers={eventHandler}
            key={ID}
            center={[posY, posX]}
            radius={4}
          >
            <Tooltip eventHandlers={eventHandler} permanent>
              {name}
            </Tooltip>
            {currentConvoy === ID && (
              <Circle
                eventHandlers={eventHandler}
                pathOptions={pathOptions}
                color="red"
                key={ID}
                center={[posY, posX]}
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
        <GeoJSON pathOptions={tradeRouteStyle} data={convoyGoalsGeoJson} />
      )}
      {convoysPointer}
    </>
  );
}
