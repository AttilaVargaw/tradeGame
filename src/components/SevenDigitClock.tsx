import { useState, useEffect } from "react";
import { Button } from "./button";
import styled from "styled-components";
import { Tick } from "./hooks/useTick";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Character = styled.div`
  width: 0.6em;
`;

export function SevenDigitClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const subscribtion = Tick.subscribe((tick) => {
      const date = new Date(tick);

      setTime(
        date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(date.toLocaleDateString());
    });

    return () => subscribtion.unsubscribe();
  }, []);

  return (
    <Button black>
      <Container>
        {[...`${date} ${time}`].map((c, i) => (
          <Character key={i}>{c}</Character>
        ))}
      </Container>
    </Button>
  );
}
