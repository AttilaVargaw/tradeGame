import { forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";

import { SevenDigitClock } from "@Components/SevenDigitClock";
import { Router } from "@Components/router";
import { useObservableValue } from "@Hooks/index";

import { currentSideMenuObservable } from "./currentSideMenu";
import { Subpages } from "./subpages";

const Container = styled.div`
  position: fixed;
  right: 0;
  background: darkgray;
  border: 1px 1px 1px 1px solid #111;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

export default forwardRef<
  HTMLDivElement,
  {
    style?: CSSProperties;
  }
>(function SideMenu({ style }, ref) {
  const currentSubpage = useObservableValue(currentSideMenuObservable);

  return (
    <Container ref={ref} style={style}>
      <SevenDigitClock />
      <Router pages={Subpages} value={currentSubpage} />
    </Container>
  );
});
