import {
  currentConvoyObservable,
  currentConvoySubject,
} from "@Components/hooks/useCurrentConvoy";
import { RedrawType, gameRedrawSubject } from "@Components/hooks/useGameLoop";
import { currentCitiesObservable } from "@Components/hooks/useSelectedCities";
import { DBEvents } from "@Services/GameState/dbTypes";
import { GameState } from "@Services/GameState/gameState";
import L, { LatLngExpression, circle } from "leaflet";
import { useEffect, useRef } from "react";

const currentConvoyMarker = circle([0, 0], {
  dashOffset: "10",
  dashArray: "2 5",
  fillOpacity: 0.5,
  radius: 6,
  color: "yellow",
  bubblingMouseEvents: false,
});

export function useConvoyLayer() {
  useEffect(() => {
    const subscription =  gameRedrawSubject.subscribe((event) => {
      switch (event) {
        case RedrawType.Convoys:
          GameState.getConvoysAsGeoJson().then((convoys) => {
            convoyLayer.current.clearLayers();
            convoyLayer.current.addData(convoys);

            if (currentConvoySubject.value) {
              currentConvoyMarker
                .addTo(convoyLayer.current)
                .setLatLng(
                  convoys.features.find(
                    (el) => el.properties.ID === currentConvoySubject.value
                  )?.geometry.coordinates as LatLngExpression
                );
            }
            GameState.getConvoyGoalsAsGeoJson().then((lines) => {
              convoyLayer.current.addData(lines);
            });
          });
      }
    });

    GameState.dbObservable.subscribe((event) => {
      if(event.type === DBEvents.convoyDock || event.type === DBEvents.convoyUnDock) {
        console.log(event.type === DBEvents.convoyDock ? "docked" : "undocked")
      }
    })

    return () => subscription.unsubscribe()
  }, []);

  useEffect(() => {
    const subscription = currentConvoyObservable.subscribe((currentConvoy) => {
      if (!currentConvoy) {
        convoyLayer.current.removeLayer(currentConvoyMarker);
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
          color: "yellow",
          radius: 4,
          bubblingMouseEvents: false,
        })
          .addEventListener("click", (event) => {
            currentConvoyMarker
              .addTo(convoyLayer.current)
              .setLatLng(coordinates as LatLngExpression);

            currentConvoySubject.next(ID);
            currentCitiesObservable.next([null, null])
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
