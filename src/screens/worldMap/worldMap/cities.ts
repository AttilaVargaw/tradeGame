import { Feature, Geometry } from "geojson";
import L, { DomEvent, LatLngExpression, circle } from "leaflet";
import { useEffect } from "react";
import { useRef } from "react";

import {
  ContextMenuPosition,
  currentCitiesObservable,
  currentCityBehaviorSubject,
  currentConvoySubject,
  currentSelectedCities,
  useCurrentSelectedConvoyAtom,
} from "@Hooks/index";
import { useCurrentModal } from "@Hooks/index";
import { addTradeRoute } from "@Services/GameState/queries/tradeRoute";
import { CityEntity } from "@Services/GameState/tables/City/CityTable";
import {
  getCities,
  getCity,
} from "@Services/GameState/tables/City/cityQueries";
import { setConvoyGoal } from "@Services/GameState/tables/Convoy/convoyQueries";
import { CityPositionProperty } from "@Services/GameState/tables/common";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";
import { addToContextMenu } from "@Services/contextMenu";

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
  const [currentConvoy, setCurrentConvoy] = useCurrentSelectedConvoyAtom();

  const citiesGeoJson =
    useRef<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>(
      undefined
    );

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
          properties: { name, type, ID, posX, posY },
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

  const features = useRef<Record<ID, Feature<Geometry, CityEntity>>>({});

  const cityLayer = useRef<L.GeoJSON<CityEntity>>(
    L.geoJSON([], {
      onEachFeature: (feature) => {
        features.current[feature.properties.ID] = feature;
      },
      attribution: "",
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
          .addEventListener("click", (event) => {
            DomEvent.stopPropagation(event);
            currentConvoySubject.next(null);

            if (event.originalEvent.shiftKey) {
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
            currentConvoySubject.next(null);
            setCurrentConvoy(null);
            if (citiesGeoJson.current) {
              const cityData = await getCity(
                features.current[ID].properties.ID
              );
              currentCityBehaviorSubject.next(cityData);
              setCurrentModal("cityInfo");
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
