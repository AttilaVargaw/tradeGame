import { PropsWithChildren } from "react";
import styled from "styled-components";

const Container = styled.div<{ height?: string; width?: string }>`
  background: grey;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  p {
    margin: 0;
  }
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
