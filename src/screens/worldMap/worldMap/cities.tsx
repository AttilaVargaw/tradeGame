import L, { LatLngExpression, circle } from "leaflet";
import {
  currentCitiesObservable,
  currentSelectedCities,
} from "@Components/hooks/useSelectedCities";
import {
  getCities,
  getCity,
} from "@Services/GameState/tables/City/cityQueries";

import { CityEntity } from "@Services/GameState/tables/City/CityTable";
import { CityPositionProperty } from "@Services/GameState/dbTypes";
import { ContextMenuPosition } from "@Components/hooks/useContextMenuPosition";
import { ID } from "@Services/GameState/dbTypes";
import { addToContextMenu } from "@Services/contextMenu";
import { addTradeRoute } from "@Services/GameState/queries/tradeRoute";
import { currentCityObservable } from "@Components/hooks/useCurrentSelectedCity";
import { currentConvoySubject } from "@Components/hooks/useCurrentConvoy";
import { setConvoyGoal } from "@Services/GameState/tables/Convoy/convoyQueries";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { useEffect } from "react";
import { useRef } from "react";

const CityColors: { [key: string]: string } = {
  Mine: "black",
  Metropolis: "blue",
  MiningTown: "red",
  MiningColony: "yellow",
  MilitaryBase: "white",
  ResearchStation: "grey",
  RandomEncounter: "gold",
};

function CityMarker() {
  return circle([0, 0], {
    dashOffset: "10",
    dashArray: "5 10",
    fillOpacity: 0.5,
    radius: 10,
    color: "grey",
    bubblingMouseEvents: false,
  });
}

const currentCitiesMarkerA = CityMarker();

const currentCitiesMarkerB = CityMarker();

export function useCitites() {
  const [, setCurrentModal] = useCurrentModal();

  const citiesGeoJson =
    useRef<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  useEffect(() => {
    getCities().then((cities) => {
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
        addTradeRoute(currentCitiesObservable.value);
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
        const marker = i === 0 ? currentCitiesMarkerA : currentCitiesMarkerB;
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
  }, []);

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
            currentConvoySubject.next(null);

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
                currentCitiesMarkerA
                  .addTo(cityLayer.current)
                  .setLatLng(cityA.geometry.coordinates as LatLngExpression)
                  .setStyle({
                    color: CityColors[cityA.properties.type],
                  });

              cityB &&
                currentCitiesMarkerB
                  .addTo(cityLayer.current)
                  .setLatLng(cityB.geometry.coordinates as LatLngExpression)
                  .setStyle({
                    color: CityColors[cityB.properties.type],
                  });

              cityLayer.current.addLayer(currentCitiesMarkerA);
              cityLayer.current.addLayer(currentCitiesMarkerB);
            } else {
              currentCitiesObservable.next([ID, null]);
              // cityLayer.current.removeLayer(currentCitiesMarkerA.current);

              const cityA = citiesGeoJson.current?.features.find(
                ({ properties }) => ID === properties.ID
              );

              cityA &&
                currentCitiesMarkerA
                  .addTo(cityLayer.current)
                  .setLatLng(cityA.geometry.coordinates as LatLngExpression)
                  .setStyle({
                    color: CityColors[cityA.properties.type],
                  });

              cityLayer.current.removeLayer(currentCitiesMarkerB);
            }
          })
          .addEventListener("dblclick", async () => {
            if (citiesGeoJson.current) {
              const cityID: ID | undefined =
                citiesGeoJson.current?.features.find(
                  ({ properties: { ID: ID2 } }) => ID === ID2
                )?.properties.ID;

              if (cityID) {
                const cityData = await getCity(cityID);
                currentCityObservable.next(cityData);
                setCurrentModal("cityInfo");
              }
            }
          })
          .addEventListener("contextmenu", () => {
            if (currentConvoySubject.value) {
              const city = citiesGeoJson.current?.features.find(
                ({ properties }) => properties.ID === ID
              );
              city &&
                setConvoyGoal(
                  currentConvoySubject.value,
                  ...(city.geometry.coordinates as [number, number])
                );
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
