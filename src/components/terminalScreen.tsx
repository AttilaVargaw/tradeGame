import React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export const Link = styled.span`
  color: blue;

  :focus,
  :hover {
    color: blueviolet;
    cursor: pointer;
  }

  text-shadow: 0 0 0.5px blue, 0 0 1px blue, 0 0 1.5px darkblue,
    0 0 2px darkblue, 0 0 2.5px darkblue, 0 0 3px darkblue, 0 0 3.5px darkblue;
`;

export const Screen = styled.div`
  color: lightgreen;
  background: #111;
  border: 2px solid grey;

  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;

  font-family: "Seven Segment";
  border-radius: 0.5em;
  justify-content: end;

  padding: 1em;
  overflow-y: auto;
  //font-family: Georgia, "Times New Roman", Times, serif;
`;

export const TerminalScreen = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    dangerouslySetInnerHTML?: string;
  }>
>(({ children, dangerouslySetInnerHTML }, ref) => {
  return (
    <Container>
      <Screen
        ref={ref}
        dangerouslySetInnerHTML={
          dangerouslySetInnerHTML
            ? { __html: dangerouslySetInnerHTML }
            : undefined
        }
        style={{ height: "100%" }}
      >
        {children}
      </Screen>
    </Container>
  );
});

TerminalScreen.displayName = "TerminalScreen";
