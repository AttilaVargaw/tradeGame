import { Label } from "@Components/label";
import { styled } from "styled-components";
import { Transfer } from "./transfer";
import { Button } from "@Components/button";
import { useCallback, useState } from "react";
import { Input } from "@Components/input";
import { ID } from "@Services/GameState/dbTypes";

const ElementContainer = styled.div`
  min-width: 10em;
  margin: auto;
  width: 100%;
`;

export function ItemTranswerRow({
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
            onChange={useCallback<React.ChangeEventHandler<HTMLInputElement>>(
              ({ target: { value } }) => setNum(Number.parseInt(value)),
              []
            )}
            style={{ width: "100%" }}
            type="number"
            onClick={onMove(true)}
            min={1}
          />
          <Button $size="small" style={{ aspectRatio: 1, alignSelf: "center" }}>
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
