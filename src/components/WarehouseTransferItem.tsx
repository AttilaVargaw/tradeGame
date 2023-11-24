import { useCallback, useState } from "react";

import { Button } from "@Components/button";
import { ID } from "@Services/GameState/dbTypes";
import { Input } from "@Components/input";
import { Label } from "@Components/label";
import { styled } from "styled-components";

const ElementContainer = styled.div`
  min-width: 10em;
  margin: auto;
  width: 100%;
`;

export function WarehouseTransferItem({
  label,
  bNum,
  aNum,
  aID,
  bID,
  interchange,
}: {
  label: string;
  aNum: number;
  bNum: number;
  aID: ID;
  bID: ID;
  interchange: (idA: number, idB: number, num: number) => void;
}) {
  const [num, setNum] = useState(1);

  const onMove = useCallback(
    (direction: boolean) => () =>
      interchange(direction ? aID : bID, direction ? bID : aID, num),
    [aID, bID, interchange, num]
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
      <ElementContainer>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            style={{ aspectRatio: 1, alignSelf: "center" }}
            $size="small"
            onClick={onMove(false)}
          >
            &lt;
          </Button>
          <Input
            value={num}
            onChange={onTransfer}
            style={{ width: "100%" }}
            type="number"
            min={1}
          />
          <Button
            onClick={onMove(true)}
            $size="small"
            style={{ aspectRatio: 1, alignSelf: "center" }}
          >
            &gt;
          </Button>
        </div>
      </ElementContainer>
      <ElementContainer>
        <Label type="led">{bNum}</Label>
      </ElementContainer>
    </>
  );
}
