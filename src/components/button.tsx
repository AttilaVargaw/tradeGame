import styled, { css } from "styled-components";

export const Button = styled.div<{
  black?: boolean;
  active?: boolean;
  disabled?: boolean;
}>`
  :hover:not([disabled]) {
    color: greenyellow;
    cursor: pointer;
  }

  box-sizing: border-box;
  height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  :active {
    border-top: 0.5em solid #444;
    border-bottom: 0.5em solid #111;
    border-left: 0.5em solid #222;
    border-right: 0.5em solid #222;
    background: ${({ black }) => (black ? "#111" : "#555")};
    font-size: 1.4em;
  }

  background: ${({ black }) => (black ? "#111" : "grey")};

  border-top: 0.5em solid #777;
  border-bottom: 0.5em solid #444;
  border-left: 0.5em solid #555;
  border-right: 0.5em solid #555;
  outline: black solid 2px;

  padding: 0.1em;
  font-size: 1.5em;
  font-family: ${({ black }) => (black ? "Seven Segment" : "Helvetica")};

  color: ${({ active, disabled }) => {
    if (!disabled) {
      return active ? "greenyellow" : "lightgreen";
    }
    return "lightgray";
  }};
  text-align: center;

  ${({ disabled }) =>
    disabled
      ? css`
          text-shadow: 0 0 0.5px lightgray, 0 0 1px lightgray, 0 0 1.5px gray,
            0 0 2px gray, 0 0 2.5px gray, 0 0 3px gray, 0 0 3.5px gray;
        `
      : css`
          text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen,
            0 0 1.5px darkgreen, 0 0 2px darkgreen, 0 0 2.5px darkgreen,
            0 0 3px darkgreen, 0 0 3.5px darkgreen;
        `}
`;
