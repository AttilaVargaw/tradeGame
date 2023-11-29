import { useEffect, useState } from "react";
import styled from "styled-components";

const DateDisplay = styled.div`
  background: black;
  border-radius: 1em;
  padding: 0.5em;
  padding-inline: 2em;
  font-family: "seven-segment";
  border: 1px solid;
  margin: 1em;
`;

const Body = styled.div<{ height: string }>`
  background: #111;
  display: flex;
  flex-direction: row;
  height: ${({ height }) => height};
  border: 1px solid black;
  background: var(0, 0, 0, 0);
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1em;
`;

export function TopMenu({ height }: { height: string }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const timeout = setInterval(() => {
      const time = new Date(
        new Date().setFullYear(1899, 1, 1) - new Date(2020).valueOf()
      );
      setTime(time.toLocaleTimeString());
      setDate(time.toLocaleDateString());
    }, 1000);

    return () => clearInterval(timeout);
  }, []);

  return (
    <Body height={height}>
      <Container>
        <DateDisplay className="glow">
          {date} {time}
        </DateDisplay>
        <DateDisplay className="glow">{5556.22} ℳ</DateDisplay>
      </Container>
    </Body>
  );
}
