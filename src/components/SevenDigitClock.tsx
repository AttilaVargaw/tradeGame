import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { Tick, TickSpeed } from "../hooks/useGameLoop";
import { useObservableValue } from "../hooks/useObservable";
import { Button } from "./button";
import { PagerProps } from "./pagerProps";
import { TogglePager } from "./togglePager";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Character = styled.div`
  width: 0.6em;
`;

const toggleValues = [
  {
    dangerouslySetInnerHTML: { __html: "&#9208;" },
    value: 0,
  },
  {
    dangerouslySetInnerHTML: { __html: "&#9205;" },
    value: 1,
  },
  {
    dangerouslySetInnerHTML: { __html: "&#9193;" },
    value: 2,
  },
  {
    dangerouslySetInnerHTML: { __html: "&#9197;" },
    value: 3,
  },
] as PagerProps<number>["values"];

export function SevenDigitClock() {
  const [time, setTime] = useState("");

  const [speed, setSpeed] = useState(1);

  const onSpeedToggleClick = useCallback((speed: number) => {
    setSpeed(speed);
    TickSpeed.next(speed);
  }, []);

  const tick = useObservableValue(Tick);

  useEffect(() => {
    tick &&
      setTime(
        new Date(tick).toLocaleTimeString(undefined, {
          hour: "2-digit",
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        })
      );
  }, [tick]);

  return (
    <div>
      <Button style={{ height: "4em" }} black>
        <Container>
          {[...time].map((c, i) => (
            <Character key={i}>{c}</Character>
          ))}
          <Character>:00</Character>
        </Container>
      </Button>
      <TogglePager
        selected={speed}
        onChange={onSpeedToggleClick}
        values={toggleValues}
      />
    </div>
  );
}
