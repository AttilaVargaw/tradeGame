import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
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
  const [, setCurrentModal] = useCurrentModal();
  const [currentConvoy, setCurrentConvoy] = useCurrentConvoy();

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
              {currentConvoy === ID && (
                <Circle
                  eventHandlers={{ dblclick: onDoubleClick(ID) }}
                  pathOptions={{
                    dashOffset: "10",
                    dashArray: "3 5",
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
    </>
  );
}
