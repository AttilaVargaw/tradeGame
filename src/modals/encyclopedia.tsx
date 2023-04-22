import { useContext } from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import { Label } from "@Components/label";
import Modal from "./Modal";
import { TerminalScreen } from "@Components/terminalScreen";

export const EncyclopediaModal = () => {
  const gameState = useContext(GameStateContext);

  return (
    <Modal
      body={() => <>{<TerminalScreen></TerminalScreen>}</>}
      footer={() => <></>}
      header={() => <Label type="painted">Encyclopedia</Label>}
    ></Modal>
  );
};
