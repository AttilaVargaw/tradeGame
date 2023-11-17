import { ContextMenuPosition } from "@Components/hooks/useContextMenuPosition";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import {
  currentCityObservable,
  currentSelectedCity,
} from "@Components/hooks/useCurrentSelectedCity";

import {
  currentCitiesObservable,
  currentSelectedCities,
} from "@Components/hooks/useSelectedCities";
import { CityPositionProperty } from "@Services/GameState/dbTypes";
import { GameState } from "@Services/GameState/gameState";
import { CityEntity } from "@Services/GameState/tables/City";
import { addToContextMenu } from "@Services/contextMenu";
import L, { LatLngExpression, circle } from "leaflet";
import { useRef } from "react";
import { useEffect } from "react";

const CityColors: { [key: string]: string } = {
  Mine: "black",
  Metropolis: "blue",
  MiningTown: "red",
  MiningColony: "yellow",
  MilitaryBase: "white",
  ResearchStation: "grey",
  RandomEncounter: "gold",
};

function useCityMarker() {
  return useRef(
    circle([0, 0], {
      dashOffset: "10",
      dashArray: "5 10",
      fillOpacity: 0.5,
      radius: 10,
      color: "grey",
      bubblingMouseEvents: false,
    })
  );
}

export function useCitites() {
  const currentCitiesMarkerA = useCityMarker();

  const currentCitiesMarkerB = useCityMarker();

  const [, setCurrentModal] = useCurrentModal();

  const citiesGeoJson =
    useRef<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  useEffect(() => {
    GameState.getCities().then((cities) => {
      citiesGeoJson.current = {
        type: "FeatureCollection",
        features: cities.map(({ posX, posY, name, type, ID }) => ({
          type: "Feature",
          geometry: {
            coordinates: [posX, posY],
            type: "Point",
          },
          properties: { name, type, ID },
        })),
      } as GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>;

      cityLayer.current.addData(citiesGeoJson.current);
    });
  }, []);

  useEffect(() => {
    const onClick = () => {
      const [cityA, cityB] = currentCitiesObservable.value;

      if (cityA && cityB) {
        GameState.addTradeRoute(currentCitiesObservable.value);
        ContextMenuPosition.next(null);
      }
    };

    return addToContextMenu({ disabled: false, labelKey: "addRoute", onClick });
  }, []);

  useEffect(() => {
    currentSelectedCities.subscribe((cities) =>
      cities.forEach((ID, i) => {
        const city = citiesGeoJson.current?.features.find(
          ({ properties }) => properties.ID === ID
        );
        const marker = (i === 0 ? currentCitiesMarkerA : currentCitiesMarkerB)
          .current;

        if (city) {
          marker
            .addTo(cityLayer.current)
            .setLatLng(city.geometry.coordinates as LatLngExpression)
            .setStyle({
              color: CityColors[city.properties.type],
            });
        } else {
          cityLayer.current.removeLayer(marker);
        }
      })
    );
  }, [currentCitiesMarkerA, currentCitiesMarkerB]);

  const cityLayer = useRef<L.GeoJSON<CityEntity>>(
    L.geoJSON([], {
      pointToLayer: ({
        geometry: { coordinates },
        properties: { ID, name, type },
      }) =>
        L.circle(coordinates as LatLngExpression, {
          radius: 8,
          interactive: true,
          className: "city-cicle",
          color: CityColors[type],
          bubblingMouseEvents: false,
        })
          .addEventListener("click", (el) => {
            if (el.originalEvent.shiftKey) {
              currentCitiesObservable.next([
                currentCitiesObservable.value[0],
                ID,
              ]);

              const cityA = citiesGeoJson.current?.features.find(
                ({ properties }) =>
                  properties.ID === currentCitiesObservable.value[0]
              );

              const cityB = citiesGeoJson.current?.features.find(
                ({ properties }) => properties.ID === ID
              );

              cityA &&
                currentCitiesMarkerA.current
                  .addTo(cityLayer.current)
                  .setLatLng(cityA.geometry.coordinates as LatLngExpression)
                  .setStyle({
                    color: CityColors[cityA.properties.type],
                  });

              cityB &&
                currentCitiesMarkerB.current
                  .addTo(cityLayer.current)
                  .setLatLng(cityB.geometry.coordinates as LatLngExpression)
                  .setStyle({
                    color: CityColors[cityB.properties.type],
                  });

              cityLayer.current.addLayer(currentCitiesMarkerA.current);
              cityLayer.current.addLayer(currentCitiesMarkerB.current);
            } else {
              currentCitiesObservable.next([ID, null]);
              // cityLayer.current.removeLayer(currentCitiesMarkerA.current);

              const cityA = citiesGeoJson.current?.features.find(
                ({ properties }) => ID === properties.ID
              );

              cityA &&
                currentCitiesMarkerA.current
                  .addTo(cityLayer.current)
                  .setLatLng(cityA.geometry.coordinates as LatLngExpression)
                  .setStyle({
                    color: CityColors[cityA.properties.type],
                  });

              cityLayer.current.removeLayer(currentCitiesMarkerB.current);
            }
          })
          .addEventListener("dblclick", () => {
            if (citiesGeoJson.current) {
              const cityID: number | undefined =
                citiesGeoJson.current?.features.find(
                  ({ properties: { ID: ID2 } }) => ID === ID2
                )?.properties.ID;

              if (cityID) {
                currentCityObservable.next(cityID);
                setCurrentModal("cityInfo");
              }
            }
          })
          .bindTooltip(type !== "RandomEncounter" ? name : "Random Encounter", {
            className: "city-marker",
            opacity: 1,
            direction: "top",
            permanent: true,
            interactive: true,
            content: type !== "RandomEncounter" ? name : "Random Encounter",
          }),
    })
  );

  return cityLayer;
}
