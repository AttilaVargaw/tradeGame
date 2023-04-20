import Form from "react-bootstrap/esm/Form";
import styled from "styled-components";

export const Input = styled(Form.Control)`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  color: lightgreen;
  background: #111;
  font-size: 1.5em;

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
`;

export const Select = styled(Form.Select)`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  color: lightgreen;
  background: #111;
  font-size: 1.5em;
  border: 2px solid grey;

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
