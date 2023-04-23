import { CityPositionProperty } from "@Services/GameState/dbTypes";
import { LeafletMouseEventHandlerFn } from "leaflet";
import { useCallback } from "react";
import { Circle, Tooltip } from "react-leaflet";

export function Convoys({
  convoysGeoJson,
}: {
  convoysGeoJson: GeoJSON.FeatureCollection<
    GeoJSON.Point,
    CityPositionProperty
  >;
}) {
  const onConvoyClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return () => {};
    },
    []
  );

  const onDoubleClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn => {
      return () => {};
    },
    []
  );

  return (
    <>
      {convoysGeoJson.features.map(
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
              <Circle
                eventHandlers={{ dblclick: onDoubleClick(ID) }}
                pathOptions={{
                  dashOffset: "10",
                  dashArray: "5 10",
                }}
                color={"red"}
                key={ID}
                center={[posY, posX]}
                radius={6}
              />
            </Circle>
          );
        }
      )}
    </>
  );
}
