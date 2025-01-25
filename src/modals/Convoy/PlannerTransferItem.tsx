import { useEffect, useState } from "react";
import styled from "styled-components";

import { Button } from "@Components/button";
import { Row } from "@Components/grid";
import { Input } from "@Components/input";
import { Label } from "@Components/label";
import { moveBetweenInventories } from "@Services/GameState/tables/ShippingPlan/ShippingPlanQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

const ElementContainer = styled.div`
  min-width: 10em;
  margin: auto;
  width: 100%;
`;

const StyledButton = styled(Button)`
  aspect-ratio: 1;
  align-self: center;
`;

export function PlannerTransferItem({
  label,
  item,
  plan,
  number,
  start,
}: {
  label: string;
  item: ID;
  plan: ID;
  number: number;
  start: boolean;
}) {
  const [num, setNum] = useState(number);

  useEffect(() => {
    setNum(Math.abs(number));
    setDirection(number > 0);
  }, [number]);

  const [direction, setDirection] = useState(false);

  const onTransfer: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    const num2 = (direction ? 1 : -1) * Number.parseInt(value);
    setNum(Number.parseInt(value));
    moveBetweenInventories(plan, num2, item, start);
  };

  const onTargetClick = () => {
    moveBetweenInventories(plan, direction ? -num : num, item, start);
    setDirection((value) => !value);
  };

  return (
    <>
      <ElementContainer>
        <Label type="painted">{label}</Label>
      </ElementContainer>
      <Row>
        <Input
          value={num}
          onChange={onTransfer}
          style={{ width: "100%" }}
          type="number"
          min={0}
        />
        <StyledButton size="small" onClick={onTargetClick}>
          {direction ? <>&gt;</> : <>&lt;</>}
        </StyledButton>
      </Row>
    </>
  );
}
