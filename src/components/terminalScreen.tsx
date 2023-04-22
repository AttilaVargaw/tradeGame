import styled from "styled-components";

const Container = styled.div`
  height: 100%;
`;

const Link = styled.p`
  color: lightblue;

  :focus,
  :hover {
    color: blueviolet;
    cursor: pointer;
  }

  text-shadow: 0 0 0.5px lightblue, 0 0 1px lightblue, 0 0 1.5px darkblue,
    0 0 2px darkblue, 0 0 2.5px darkblue, 0 0 3px darkblue, 0 0 3.5px darkblue;
`;

const Screen = styled.div`
  color: lightgreen;
  background: #111;
  border: 2px solid grey;

  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;

  font-family: "Seven Segment";
  border-radius: 0.5em;
  justify-content: end;

  height: 100%;
  width: 100%;
  padding: 1em;
  //font-family: Georgia, "Times New Roman", Times, serif;
`;

export function TerminalScreen() {
  return (
    <Container>
      <Screen>
        <h1>Test</h1>
        <p>Text</p>
        <Link>Link</Link>
      </Screen>
    </Container>
  );
}
