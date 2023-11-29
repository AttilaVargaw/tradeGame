import { useCallback, useState } from "react";
import styled from "styled-components";

import { Button } from "./button";
import { Grid, Row } from "./grid";
import { Label } from "./label";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledButton = styled(Button)`
  aspect-ratio: 1;
  align-self: center;
`;

export function Pager({
  pages,
  onChange,
}: {
  pages: string[];
  onChange: (next: string) => void;
}) {
  const [index, setIndex] = useState(0);

  return (
    <Row>
      <StyledButton
        $size="small"
        onClick={useCallback(() => {
          if (0 > index - 1) {
            const i = pages.length - 1;

            onChange(pages[i]);
            setIndex(i);
          } else {
            const i = index - 1;

            onChange(pages[i]);
            setIndex(i);
          }
        }, [index, onChange, pages])}
      >
        &lt;
      </StyledButton>
      <Label type="led" style={{ width: "100%" }}>
        {pages[index]}
      </Label>
      <StyledButton
        onClick={useCallback(() => {
          if (pages.length === index + 1) {
            onChange(pages[0]);
            setIndex(0);
          } else {
            onChange(pages[index + 1]);
            setIndex((i) => ++i);
          }
        }, [index, onChange, pages])}
        $size="small"
      >
        &gt;
      </StyledButton>
    </Row>
  );
}
