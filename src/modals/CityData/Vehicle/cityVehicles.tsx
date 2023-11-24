import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useCurrentSelectedConvoyAtom } from "@Components/hooks/useCurrentSelectedConvoy";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { Toggle } from "@Components/toggle";
import { getDockedConvoysForCity } from "@Services/GameState/tables/City/cityQueries";
import { ConvoyData } from "@Services/GameState/tables/Convoy/Convoy";
import { VehicleData } from "@Services/GameState/tables/Vehicle/Vehicle";

import { CityVehiclesCrew } from "./cityVehiclesCrew";
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
  const [currentConvoy, setCurrentConvoy] = useCurrentSelectedConvoyAtom();

  useEffect(() => {
    cityID && getDockedConvoysForCity(cityID.ID).then(setConvoys);
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
          convoys.map((convoy) => (
            <Link onClick={() => setCurrentConvoy(convoy)} key={convoy.ID}>
              {convoy.name}
            </Link>
          ))}
      </TerminalScreen>
    );
  }, [convoys, currentConvoy, setCurrentConvoy, subpage]);

  return (
    <Container style={{ margin: "16pt", height: "80%" }}>{body}</Container>
  );
}
