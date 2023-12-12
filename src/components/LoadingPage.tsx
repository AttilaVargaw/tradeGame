import styled from "styled-components";

import { LoadingBar } from "./LoadingBar";
import { Label } from "./label";

const Container = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  bottom: 10%;
  width: 100%;
`;

export function LoadingPage() {
  return (
    <Container>
      <div>
        <Label style={{ width: "80%" }} type="led">
          ...Loading
        </Label>
        <LoadingBar percent={100} />
      </div>
    </Container>
  );
}
