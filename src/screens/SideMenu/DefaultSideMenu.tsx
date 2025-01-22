import { Button } from "@Components/button";
import { GetConvoiyCount } from "@Services/GameState/tables/Convoy/convoyQueries";
import { GetVehicleCount } from "@Services/GameState/tables/Vehicle/vehiclesQueries";

import {
  ModalOpenerButton,
  ModalOpenerButtonWithCounter,
} from "./ModalOpenerButton";

export function DefaultSideMenu() {
  return (
    <>
      <ModalOpenerButtonWithCounter
        countFn={() => Promise.resolve(0)}
        label="Messages"
        modal={null}
      />
      <ModalOpenerButtonWithCounter
        countFn={() => Promise.resolve(0)}
        label="5556.22 ℳ"
        modal={null}
      />
      <ModalOpenerButtonWithCounter
        countFn={() => GetVehicleCount()}
        label="Vehicles"
        modal="vehicle"
      />
      <ModalOpenerButtonWithCounter
        countFn={() => GetConvoiyCount()}
        label="Convoys"
        modal="convoys"
      />
      <ModalOpenerButton label="Encyclopedia" modal="encyclopedia" />
      <Button>Command Staff</Button>
      <Button>Human Rescources</Button>
    </>
  );
}
