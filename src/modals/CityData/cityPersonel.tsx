import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Label } from "@Components/label";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-between;
`;

const ElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 10em;
`;

export default function CityPersonel() {
  const [cityID] = useCurrentSelectedCity();

  return (
    <Container style={{ margin: "16pt" }}>
      <ElementContainer>
        <Label style={{ width: "100%" }} type="painted">
          Master
        </Label>
        <Label style={{ width: "100%" }} type="led">
          {0}
        </Label>
      </ElementContainer>
      <ElementContainer>
        <Label style={{ width: "100%" }} type="painted">
          Mechanist
        </Label>
        <Label style={{ width: "100%" }} type="led">
          {0}
        </Label>
      </ElementContainer>
      <ElementContainer>
        <Label style={{ width: "100%" }} type="painted">
          Researcher
        </Label>
        <Label style={{ width: "100%" }} type="led">
          {0}
        </Label>
      </ElementContainer>
      <ElementContainer>
        <Label style={{ width: "100%" }} type="painted">
          Guard
        </Label>
        <Label style={{ width: "100%" }} type="led">
          {0}
        </Label>
      </ElementContainer>
      <ElementContainer>
        <Label style={{ width: "100%" }} type="painted">
          Cadet
        </Label>
        <Label style={{ width: "100%" }} type="led">
          {0}
        </Label>
      </ElementContainer>
    </Container>
  );
}
