import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { DBEvents } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { LeafletMouseEventHandlerFn } from "leaflet";
import { useCallback, useContext, useEffect, useState } from "react";
import { Circle, Tooltip } from "react-leaflet";
import { GeoJSON } from "react-leaflet";

const tradeRouteStyle = {
  color: "grey",
  weight: 4,
  fillColor: "#1a1d62",
  fillOpacity: 0.5,
  dashArray: "2 10",
};

export function Convoys() {
  const [, setCurrentModal] = useCurrentModal();
  const [currentConvoy, setCurrentConvoy] = useCurrentConvoy();
  const gameState = useContext(GameStateContext);

  const onConvoyClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return () => {
        setCurrentConvoy(ID);
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
      setConvoyGoalsGeoJson(undefined);
      gameState.getConvoyGoalsAsGeoJson().then(setConvoyGoalsGeoJson);

      setConvoysGeoJson(undefined);
      gameState.getConvoysAsGeoJson().then(setConvoysGeoJson);
      return;
    });

    return () => subscription.unsubscribe();
  }, [gameState]);

  return (
    <>
      {convoysGeoJson?.features.map(
        ({
          geometry: {
            coordinates: [posX, posY],
          },
          properties: { ID, name },
        }) => {
          return (
            <Circle
              color={"red"}
              eventHandlers={{
                dblclick: onDoubleClick(ID),
                click: onConvoyClick(ID),
              }}
              key={ID}
              center={[posY, posX]}
              radius={4}
            >
              <Tooltip permanent>{name}</Tooltip>
              {currentConvoy === ID && (
                <Circle
                  eventHandlers={{ dblclick: onDoubleClick(ID) }}
                  pathOptions={{
                    dashOffset: "10",
                    dashArray: "3 5",
                    fillOpacity: 0.5,
                  }}
                  color={"red"}
                  key={ID}
                  center={[posY, posX]}
                  radius={6}
                />
              )}
            </Circle>
          );
        }
      )}
      {convoyGoalsGeoJson && (
        <GeoJSON pathOptions={tradeRouteStyle} data={convoyGoalsGeoJson} />
      )}
    </>
  );
}
