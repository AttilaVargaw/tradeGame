import { useState, useEffect, useCallback } from "react";
import { Button } from "./button";
import styled from "styled-components";
import { Toggle } from "./toggle";
import { Tick, TickSpeed } from "./hooks/useGameLoop";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Character = styled.div`
  width: 0.6em;
`;

export function SevenDigitClock() {
  const [time, setTime] = useState("");

  const [speed, setSpeed] = useState(1);

  const onSpeedToggleClick = useCallback(
    (speed: number) => () => {
      setSpeed(speed);
      TickSpeed.next(speed);
    },
    []
  );

  useEffect(() => {
    const subscribtion = Tick.subscribe((tick) => {
      const date = new Date(tick);

      window.requestAnimationFrame(() => {
        setTime(
          date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })
        );
      });
    });

    return () => subscribtion.unsubscribe();
  }, []);

  return (
    <div>
      <Button black>
        <Container>
          {[...time].map((c, i) => (
            <Character key={i}>{c}</Character>
          ))}
          <Character>:00</Character>
        </Container>
      </Button>
      <div
        style={{
          display: "grid",
          gridAutoColumns: "1fr",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        <Toggle active={speed === 0} onChange={onSpeedToggleClick(0)}>
          &#9208;
        </Toggle>
        <Toggle active={speed === 1} onChange={onSpeedToggleClick(1)}>
          &#9205;
        </Toggle>
        <Toggle active={speed === 4} onChange={onSpeedToggleClick(4)}>
          &#9193;
        </Toggle>
        <Toggle active={speed === 8} onChange={onSpeedToggleClick(8)}>
          &#9197;
        </Toggle>
      </div>
    </div>
  );
}
