import { useCallback, useState } from "react";
import { styled } from "styled-components";

import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { Button } from "./button";
import { Row } from "./grid";
import { Input } from "./input";
import { Label } from "./label";

const ElementContainer = styled.div`
  min-width: 10em;
  margin: auto;
  width: 100%;
`;

const StyledButton = styled(Button)`
  aspect-ratio: 1;
  align-self: center;
`;

export function WarehouseTransferItem({
  label,
  bNum,
  aNum,
  aID,
  bID,
  interchange,
  disabled,
  item,
}: {
  label: string;
  aNum: number;
  bNum: number;
  aID: ID;
  bID: ID;
  interchange: (idA: number, idB: number, num: number, item: ID) => void;
  disabled?: boolean;
  item: ID;
}) {
  const [num, setNum] = useState(1);

  const onMove = useCallback(
    (direction: boolean) => () =>
      interchange(direction ? aID : bID, direction ? bID : aID, num, item),
    [aID, bID, interchange, item, num]
  );

  const onTransfer = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value } }) => setNum(Number.parseInt(value)),
    []
  );

  return (
    <>
      <ElementContainer>
        <Label type="painted">{label}</Label>
      </ElementContainer>
      <ElementContainer>
        <Label type="led">{aNum}</Label>
      </ElementContainer>
      <Row>
        <StyledButton
          disabled={aID === -1 || bID === -1 || bNum - num < 0}
          size="small"
          onClick={onMove(false)}
        >
          &lt;
        </StyledButton>
        <Input
          value={num}
          onChange={onTransfer}
          style={{ width: "100%" }}
          type="number"
          min={1}
        />
        <StyledButton
          disabled={aID === -1 || bID === -1 || aNum - num < 0}
          size="small"
          onClick={onMove(true)}
        >
          &gt;
        </StyledButton>
      </Row>

      <ElementContainer>
        <Label type="led">{bNum}</Label>
      </ElementContainer>
    </>
  );
}
