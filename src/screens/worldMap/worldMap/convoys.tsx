import L, {
  DomEvent,
  LatLngExpression,
  PathOptions,
  circle,
  tooltip,
} from "leaflet";
import { useEffect, useRef } from "react";

import {
  RedrawType,
  currentCitiesObservable,
  gameRedrawSubject,
} from "@Hooks/index";
import { currentConvoyObservable, currentConvoySubject } from "@Hooks/index";
import { ConvoyData } from "@Services/GameState/tables/Convoy/Convoy";
import {
  getConvoyGoalsAsGeoJson,
  getConvoysAsGeoJson,
} from "@Services/GameState/tables/Convoy/convoyQueries";

import { currentSideMenuBehaviorSubject } from "./../../SideMenu/currentSideMenu";

const currentRouteStyle: PathOptions = {
  color: "greenyellow",
  weight: 5,
  fillColor: "greenyellow",
  fillOpacity: 1,
  lineCap: "square",
  opacity: 0.5,
  dashArray: [2, 10],
};

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

  const convoyLayer = useRef<L.GeoJSON<ConvoyData>>(
    L.geoJSON([], {
      pointToLayer: ({
        geometry: { coordinates },
        properties: { ID, name },
      }) => {
        const convoyTooltip = tooltip({
          className: "marker",
          content: name,
          permanent: true,
          direction: "top",
          interactive: true,
        });

        return circle(coordinates as LatLngExpression, {
          color: "yellow",
          radius: 4,
          bubblingMouseEvents: false,
          interactive: true,
        })
          .bindTooltip(convoyTooltip)
          .addEventListener("click", (event) => {
            DomEvent.stopPropagation(event);

            currentConvoyMarker
              .addTo(convoyLayer.current)
              .setLatLng(coordinates as LatLngExpression);

            currentConvoySubject.next(ID);
            currentSideMenuBehaviorSubject.next("convoy");
            currentCitiesObservable.next([null, null]);
          });
      },
    })
  );

  return convoyLayer;
}
