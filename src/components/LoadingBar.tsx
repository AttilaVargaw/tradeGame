import styled from "styled-components";

import { ScreenText } from "./terminalScreen";

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-width: 4%;

  background: #111;
  box-sizing: border-box;
  padding: 1em;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
`;

function getColoumnColor(
  i: number,
  percent: number
): { base: string; light?: string; dark?: string } {
  if ((100 - percent) / 5 > i) {
    return { base: "grey" };
  }

  if (percent < 80) {
    return { base: "lightgreen", light: "lightgreen", dark: "darkgreen" };
  } else if (percent < 100) {
    return { base: "yellow", light: "yellowgreen", dark: "orange" };
  }
  return { base: "red", light: "pink", dark: "darkred" };
}

export function LoadingBar({ percent }: { percent: number }) {
  const elements = Array(20)
    .fill("")
    .map((e, i) => {
      const color = getColoumnColor(i, percent);

      return (
        <div
          key={i}
          style={{
            height: "5%",
            backgroundColor: color.base,
            //border: "solid 0.1em",
            margin: "0.1em",
            boxSizing: "border-box",
            borderRadius: "2px",
            boxShadow:
              color.base === "grey"
                ? undefined
                : `0 0 0.5px ${color.light}, 0 0 1px ${color.light}, 0 0 1.5px ${color.dark}, 0 0 2px ${color.dark}, 0 0 2.5px ${color.dark}, 0 0 3px ${color.dark}, 0 0 3.5px ${color.dark}`,
          }}
        />
      );
    });

  return (
    <Container>
      {elements}
      <ScreenText
        style={{ justifyContent: "center", display: "flex", marginTop: "1em" }}
      >
        {percent.toFixed(0)}%
      </ScreenText>
    </Container>
  );
}
