import { CityPositionProperty } from "@Services/GameState/dbTypes";
import { LeafletMouseEventHandlerFn } from "leaflet";
import { useCallback } from "react";
import { Circle, Tooltip } from "react-leaflet";

export function Vehicles({
  vehiclesGeoJson,
}: {
  vehiclesGeoJson: GeoJSON.FeatureCollection<
    GeoJSON.Point,
    CityPositionProperty
  >;
}) {
  const onVehicleClick = useCallback(
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
      {vehiclesGeoJson.features.map(
        ({
          geometry: {
            coordinates: [posX, posY],
          },
          properties: { ID, name },
        }) => {
          return (
            <Circle
              color={"gold"}
              eventHandlers={{
                dblclick: onDoubleClick(ID),
                click: onVehicleClick(ID),
              }}
              key={ID}
              center={[posY, posX]}
              radius={5}
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
                radius={7}
              />
            </Circle>
          );
        }
      )}
    </>
  );
}
