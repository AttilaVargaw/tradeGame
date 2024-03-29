import styled from "styled-components";

export const Input = styled.input`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  color: lightgreen;
  background: #111 !important;
  font-size: 1.2em;
  border: none;
  border-radius: 0.5em;
  margin: 0.2em;
  text-align: end;
  height: 1em;

  :focus,
  :hover {
    color: greenyellow;
    cursor: pointer;
    border-color: #111;
    background: #111;
  }

  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;

  font-family: "Seven Segment";
  outline: 2px solid grey;
`;

export const Select = styled.select`
  padding: 0.5em;
  color: lightgreen;
  background: #111 !important;
  font-size: 1.2em;
  border: none;
  border-radius: 0.5em;
  margin: 0.2em;
  text-align: end;
  height: 2em;

  :focus,
  :hover {
    color: greenyellow;
    cursor: pointer;
    border-color: greenyellow;
    background: #111;
  }

  text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen, 0 0 1.5px darkgreen,
    0 0 2px darkgreen, 0 0 2.5px darkgreen, 0 0 3px darkgreen,
    0 0 3.5px darkgreen;

  font-family: "Seven Segment";
`;
