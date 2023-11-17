import { ClickableTooltip } from "@Components/ClickableTooltip";
import {
  currentConvoyObservable,
  currentConvoySubject,
} from "@Components/hooks/useCurrentConvoy";
import { RedrawType, gameRedrawSubject } from "@Components/hooks/useGameLoop";
import { GameStateContext } from "@Services/GameState/gameState";
import L, { LatLngExpression, circle } from "leaflet";
import { useContext, useEffect, useRef } from "react";

export function useConvoyLayer() {
  const gameState = useContext(GameStateContext);

  const currentConvoyMarker = useRef(
    circle([0, 0], {
      dashOffset: "10",
      dashArray: "2 5",
      fillOpacity: 0.5,
      radius: 6,
      color: "green",
      bubblingMouseEvents: false,
    })
  );

  useEffect(() => {
    gameRedrawSubject.subscribe((event) => {
      switch (event) {
        case RedrawType.Convoys:
          gameState.getConvoysAsGeoJson().then((convoys) => {
            convoyLayer.current.clearLayers();
            convoyLayer.current.addData(convoys);

            if (currentConvoySubject.value) {
              currentConvoyMarker.current
                .addTo(convoyLayer.current)
                .setLatLng(
                  convoys.features.find(
                    (el) => el.properties.ID === currentConvoySubject.value
                  )?.geometry.coordinates as LatLngExpression
                );
            }
            gameState.getConvoyGoalsAsGeoJson().then((lines) => {
              convoyLayer.current.addData(lines);
            });
          });
      }
    });
  }, [gameState]);

  useEffect(() => {
    const subscription = currentConvoyObservable.subscribe((currentConvoy) => {
      if (!currentConvoy) {
        convoyLayer.current.removeLayer(currentConvoyMarker.current);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const convoyLayer = useRef<L.GeoJSON>(
    L.geoJSON([], {
      pointToLayer: ({
        geometry: { coordinates },
        properties: { ID, name },
      }) => {
        return circle(coordinates as LatLngExpression, {
          color: "green",
          radius: 4,
          bubblingMouseEvents: false,
        })
          .addEventListener("click", (event) => {
            console.log("test2", currentConvoySubject);
            currentConvoyMarker.current
              .addTo(convoyLayer.current)
              .setLatLng(coordinates as LatLngExpression);

            currentConvoySubject.next(ID);
          })
          .bindTooltip(
            new L.Tooltip({
              className: "marker",
              content: name,
              permanent: true,
              direction: "top",
              interactive: true,
            })
          );
      },
    })
  );

  return convoyLayer;
}
