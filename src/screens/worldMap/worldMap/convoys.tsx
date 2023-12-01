import L, { LatLngExpression, circle } from "leaflet";
import { useEffect, useRef } from "react";

import {
  currentConvoyObservable,
  currentConvoySubject,
} from "@Components/hooks/useCurrentConvoy";
import { RedrawType, gameRedrawSubject } from "@Components/hooks/useGameLoop";
import { currentCitiesObservable } from "@Components/hooks/useSelectedCities";
import {
  getConvoyGoalsAsGeoJson,
  getConvoysAsGeoJson,
} from "@Services/GameState/tables/Convoy/convoyQueries";

import { currentSideMenuBehaviorSubject } from "./../../SideMenu/currentSideMenu";

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
    function Update() {
      getConvoysAsGeoJson().then((convoys) => {
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
        getConvoyGoalsAsGeoJson().then((lines) => {
          convoyLayer.current.addData(lines);
        });
      });
    }

    Update();

    const subscription = gameRedrawSubject.subscribe((event) => {
      switch (event) {
        case RedrawType.Convoys:
          Update();
      }
    });

    return () => subscription.unsubscribe();
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
      pointToLayer: ({ geometry: { coordinates }, properties: { ID, name } }) =>
        circle(coordinates as LatLngExpression, {
          color: "yellow",
          radius: 4,
          bubblingMouseEvents: false,
        })
          .addEventListener("click", (event) => {
            currentConvoyMarker
              .addTo(convoyLayer.current)
              .setLatLng(coordinates as LatLngExpression);

            currentConvoySubject.next(ID);
            currentSideMenuBehaviorSubject.next("convoy");
            currentCitiesObservable.next([null, null]);
          })
          .bindTooltip(
            new L.Tooltip({
              className: "marker",
              content: name,
              permanent: true,
              direction: "top",
              interactive: true,
            })
          ),
    })
  );

  return convoyLayer;
}
