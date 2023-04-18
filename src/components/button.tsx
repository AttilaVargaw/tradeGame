import styled from "styled-components";

export const Button = styled.div<{ black?: boolean; active?: boolean }>`
  :hover {
    color: greenyellow;
    cursor: pointer;
    border-color: #111;
  }

  background: ${({ black }) => (black ? "#111" : "grey")};
  border-radius: 2px;
  padding: 0.5em;
  font-size: 1.5em;
  font-family: ${({ black }) => (black ? "Seven Segment" : "Helvetica")};
  border: 2px solid black;

  color: ${({ active }) => (active ? "greenyellow" : "lightgreen")};
  text-align: center;
  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;
`;
