import { ContextMenuPosition } from "@Components/hooks/useContextMenuPosition";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useCurrentSelectedCities } from "@Components/hooks/useSelectedCities";
import { CityPositionProperty } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import { addToContextMenu } from "@Services/contextMenu";
import { LeafletMouseEventHandlerFn } from "leaflet";
import { useMemo } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Circle, LayerGroup, LayersControl, Tooltip } from "react-leaflet";

const CityColors: { [key: string]: string } = {
  Mine: "black",
  Metropolis: "blue",
  MiningTown: "red",
  MiningColony: "yellow",
  MilitaryBase: "white",
  ResearchStation: "grey",
  RandomEncounter: "gold",
};

export function Cities() {
  const [selectedCities, setSelectedCities] = useCurrentSelectedCities();

  const gameState = useContext(GameStateContext);

  const [, setCurrentModal] = useCurrentModal();

  const [, setCurrentSelectedCity] = useCurrentSelectedCity();

  const [, setCurrentSelectedCities] = useCurrentSelectedCities();

  //const map = useMap()

  useEffect(() => {
    gameState.getCitiesAsGeoJson().then(setCitiesGeoJson);
  }, [gameState]);

  const [citiesGeoJson, setCitiesGeoJson] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Point, CityPositionProperty>>();

  useEffect(() => {
    const onClick = () => {
      const [cityA, cityB] = selectedCities;

      if (cityA && cityB) {
        gameState.addTradeRoute(selectedCities);
        ContextMenuPosition.next(null);
      }
    };

    return addToContextMenu({ disabled: false, labelKey: "addRoute", onClick });
  }, [selectedCities, gameState]);

  useEffect(() => {
    function OutSideClick(this: Window, ev: MouseEvent) {
      if (ev.button === 0 && !ev.ctrlKey) {
        if (!ev.shiftKey) {
          setCurrentSelectedCities([null, null]);
        }
      }
    }

    window.addEventListener("click", OutSideClick, true);

    return () => window.removeEventListener("click", OutSideClick);
  }, [gameState, setCurrentSelectedCities]);

  const onDoubleClick = useCallback(
    (city: number): LeafletMouseEventHandlerFn =>
      () => {
        if (citiesGeoJson) {
          const cityID: number | undefined = citiesGeoJson?.features.find(
            ({ properties: { ID } }) => ID === city
          )?.properties.ID;

          if (cityID) {
            setCurrentSelectedCity(cityID);
            setCurrentModal("cityInfo");
          }
        }
      },
    [setCurrentSelectedCity, citiesGeoJson, setCurrentModal]
  );

  const onCityClick = useCallback(
    (ID: number): LeafletMouseEventHandlerFn =>
      ({ originalEvent: { shiftKey } }) => {
        setSelectedCities((s) => [shiftKey ? s[0] : ID, shiftKey ? ID : null]);
      },
    [setSelectedCities]
  );

  const cities = useMemo(
    () =>
      citiesGeoJson?.features.map(
        ({
          geometry: {
            coordinates: [posX, posY],
          },
          properties: { ID, name, type },
        }) => {
          return (
            <Circle
              color={CityColors[type]}
              eventHandlers={{
                dblclick: onDoubleClick(ID),
                click: onCityClick(ID),
              }}
              key={ID}
              center={[posY, posX]}
              radius={8}
              interactive
              className="city-cirlce"
            >
              <Tooltip
                className="city-marker"
                opacity={1}
                direction="top"
                interactive
                permanent
              >
                {type !== "RandomEncounter" ? name : "Random Encounter"}
              </Tooltip>
              {(selectedCities[0] === ID || selectedCities[1] === ID) && (
                <Circle
                  eventHandlers={{ dblclick: onDoubleClick(ID) }}
                  pathOptions={{
                    dashOffset: "10",
                    dashArray: "5 10",
                  }}
                  color={CityColors[type]}
                  key={ID}
                  center={[posY, posX]}
                  radius={10}
                />
              )}
            </Circle>
          );
        }
      ),
    [citiesGeoJson?.features, onCityClick, onDoubleClick, selectedCities]
  );

  return (
    <LayersControl.Overlay checked name="Cities">
      <LayerGroup>{cities}</LayerGroup>
    </LayersControl.Overlay>
  );
}
