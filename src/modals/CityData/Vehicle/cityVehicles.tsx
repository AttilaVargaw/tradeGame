import { useEffect, useState } from "react";
import styled from "styled-components";

import { Link, TerminalScreen } from "@Components/terminalScreen";
import { TogglePager } from "@Components/togglePager";
import { useCurrentSelectedCity } from "@Hooks/index";
import { useCurrentSelectedConvoyAtom } from "@Hooks/index";
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

const pages = [
  {
    label: "Crew",
    value: Subpages.Crew,
  },
  {
    label: "Inventory",
    value: Subpages.List,
  },
];

export default function CityVehicles() {
  const [vehicles] = useState<VehicleData[]>([]);
  const [convoys, setConvoys] = useState<ConvoyData[]>([]);

  const [cityID] = useCurrentSelectedCity();

  const [subpage, setSubpage] = useState<Subpages>(Subpages.List);
  const [currentConvoy, setCurrentConvoy] = useCurrentSelectedConvoyAtom();

  useEffect(() => {
    cityID && getDockedConvoysForCity(cityID.ID).then(setConvoys);
  }, [cityID]);

  const body = currentConvoy ? (
    <>
      <TogglePager selected={subpage} onChange={setSubpage} values={pages} />
      {subpage === Subpages.Crew && <CityVehiclesCrew />}
      {subpage === Subpages.List && <CityVehiclesInventory />}
    </>
  ) : (
    <TerminalScreen style={{ height: "-webkit-fill-available" }}>
      {convoys.map((convoy) => (
        <Link onClick={() => setCurrentConvoy(convoy)} key={convoy.ID}>
          {convoy.name}
        </Link>
      ))}
    </TerminalScreen>
  );

  return (
    <Container style={{ margin: "16pt", height: "80%" }}>{body}</Container>
  );
}
