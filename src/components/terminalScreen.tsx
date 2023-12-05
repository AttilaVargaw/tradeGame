import React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

import { PagerItemProps } from "./pagerProps";

const Container = styled.div`
  height: 100%;
  width: 100%;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

export const Link = styled.div`
  color: blue;

  &:focus,
  &:hover {
    color: blueviolet;
    cursor: pointer;
  }

  text-shadow: 0 0 0.5px blue, 0 0 1px blue, 0 0 1.5px darkblue,
    0 0 2px darkblue, 0 0 2.5px darkblue, 0 0 3px darkblue, 0 0 3.5px darkblue;
`;

export function PagerLink({ active, onChange, children }: PagerItemProps) {
  return (
    <Link onClick={onChange}>
      {children}
      {active && " [X]"}
    </Link>
  );
}

export const ScreenText = styled.div`
  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;
  color: lightgreen;
  background: #111;
  font-family: "Seven Segment";
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
    dangerouslySetInnerHTML?: { __html: string };
    style?: React.CSSProperties;
    rows?: number;
  }>
>(({ children, dangerouslySetInnerHTML, style, rows }, ref) => {
  return (
    <Container>
      <Screen
        ref={ref}
        style={{ ...style, height: rows ? `${rows}em` : style?.height }}
        {...{
          dangerouslySetInnerHTML,
          children,
        }}
      />
    </Container>
  );
});

TerminalScreen.displayName = "TerminalScreen";
