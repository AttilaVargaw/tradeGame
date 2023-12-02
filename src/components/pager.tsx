import { useCallback, useState } from "react";
import styled from "styled-components";

import { Button } from "./button";
import { Row } from "./grid";
import { Label } from "./label";
import { PagerProps } from "./pagerProps";

const StyledButton = styled(Button)`
  aspect-ratio: 1;
  align-self: center;
`;

export function Pager<T>({ values, onChange }: PagerProps<T>) {
  const [index, setIndex] = useState(0);

  const onMinusClick = useCallback(() => {
    if (0 > index - 1) {
      const i = values.length - 1;

      onChange(values[i].value);
      setIndex(i);
    } else {
      const i = index - 1;

      onChange(values[i].value);
      setIndex(i);
    }
  }, [index, onChange, values]);

  const onAddClick = useCallback(() => {
    if (0 > index - 1) {
      const i = values.length - 1;

      onChange(values[i].value);
      setIndex(i);
    } else {
      const i = index - 1;

      onChange(values[i].value);
      setIndex(i);
    }
  }, [index, onChange, values]);

  return (
    <Row>
      <StyledButton size="small" onClick={onMinusClick}>
        &lt;
      </StyledButton>
      <Label type="led" style={{ width: "100%" }}>
        {values[index].label ?? ""}
      </Label>
      <StyledButton onClick={onAddClick} size="small">
        &gt;
      </StyledButton>
    </Row>
  );
}
