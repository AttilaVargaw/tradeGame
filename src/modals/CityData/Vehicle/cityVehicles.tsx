import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { getDockedConvoysForCity } from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CityVehiclesCrew } from "./cityVehiclesCrew";
import { Toggle } from "@Components/toggle";
import { CityVehiclesInventory } from "./cityVehiclesInventory";

const Container = styled.div``;

enum Subpages {
  Crew,
  List,
}

export default function CityVehicles() {
  const [vehicles] = useState<VehicleData[]>([]);
  const [convoys, setConvoys] = useState<ConvoyData[]>([]);

  const [cityID] = useCurrentSelectedCity();

  const [subpage, setSubpage] = useState<Subpages>(Subpages.List);
  const [currentConvoy, setCurrentConvoy] = useState<number | null>(null);

  useEffect(() => {
    cityID && getDockedConvoysForCity(cityID).then(setConvoys);
  }, [cityID]);

  const body = useMemo(() => {
    if (currentConvoy) {
      return (
        <>
          <div
            style={{
              width: "100%",
              display: "grid",
              gridAutoColumns: "1fr",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <Toggle
              onChange={() => setSubpage(Subpages.Crew)}
              active={subpage === Subpages.Crew}
            >
              Crew
            </Toggle>
            <Toggle
              onChange={() => setSubpage(Subpages.List)}
              active={subpage === Subpages.List}
            >
              Inventory
            </Toggle>
          </div>
          {subpage === Subpages.Crew && <CityVehiclesCrew />}
          {subpage === Subpages.List && <CityVehiclesInventory />}
        </>
      );
    }
    return (
      <TerminalScreen>
        {convoys &&
          convoys.map(({ ID, name }) => (
            <Link onClick={() => setCurrentConvoy(ID)} key={ID}>
              {name}
            </Link>
          ))}
      </TerminalScreen>
    );
  }, [convoys, currentConvoy, subpage]);

  return (
    <Container style={{ margin: "16pt", height: "80%" }}>{body}</Container>
  );
}
