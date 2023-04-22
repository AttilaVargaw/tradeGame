import { PropsWithChildren } from "react";
import styled from "styled-components";

const Container = styled.div<{ height?: string; width?: string }>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  text-align: center;
  color: lightgreen;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #111;
  border: 2px solid grey;
  border-radius: 0.5em;

  p {
    margin: 0;
  }

  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;
`;

export default function Placeholder({
  height,
  width,
}: PropsWithChildren<{ height?: string; width?: string }>) {
  return (
    <Container height={height} width={width}>
      <p>{`${width} X ${height}`}</p>
    </Container>
  );
}
