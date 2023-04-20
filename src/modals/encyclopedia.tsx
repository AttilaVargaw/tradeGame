import { useCallback, useContext, useEffect, useState } from "react";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import Row from "react-bootstrap/esm/Row";
import { Convoy, Vehicle } from "@Services/GameState/dbTypes";
import { GameStateContext } from "@Services/GameState/gameState";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { Input, Select } from "@Components/input";
import { Label } from "@Components/label";
import { Button } from "@Components/button";

export const ConvoyModal = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose?: () => void;
}) => {
  const gameState = useContext(GameStateContext);

  return (
    <Modal show={isOpen} onHide={onRequestClose} size="xl">
      <Modal.Header>
        <Label type="led" style={{ width: "100%" }}>
          Convoys
        </Label>
      </Modal.Header>
    </Modal>
  );
};
