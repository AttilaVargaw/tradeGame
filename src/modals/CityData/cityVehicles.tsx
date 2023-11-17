import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { Label } from "@Components/label";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { GameState } from "@Services/GameState/gameState";
import { ConvoyData } from "@Services/GameState/tables/Convoy";
import { VehicleData } from "@Services/GameState/tables/Vehicle";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-between;
`;

const ElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 10em;
`;

export default function CityVehicles() {
  const [vehicles] = useState<VehicleData[]>([]);
  const [convoys, setConvoys] = useState<ConvoyData[]>([]);

  const [cityID] = useCurrentSelectedCity();

  console.log(convoys, cityID)
  useEffect(() => {
    cityID && GameState.getDockedConvoysForCity(cityID).then(setConvoys);
  }, [cityID]);

  return (
    <Container style={{ margin: "16pt" }}>
      <TerminalScreen
      //dangerouslySetInnerHTML={article}
      //ref={terminalRef}
      >
        {convoys &&
          convoys.map(({ ID, name }) => (
            <Link onClick={() => undefined} key={ID}>
              {name}
            </Link>
          ))}
      </TerminalScreen>
    </Container>
  );
}
