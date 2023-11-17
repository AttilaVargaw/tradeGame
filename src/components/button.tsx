import styled, { css } from "styled-components";

export const Button = styled.div<{
  $black?: boolean;
  $active?: boolean;
  disabled?: boolean;
  red?: boolean;
}>`
  &:hover:not([disabled]) {
    color: greenyellow;
    cursor: pointer;
  }

  box-sizing: border-box !important;
  height: 4rem !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;

  &:active {
    border-top: 0.7em solid #444 !important;
    border-bottom: 0.7em solid #111 !important;
    border-left: 0.7em solid #222 !important;
    border-right: 0.7em solid #222 !important;
    background: ${({ $black }) => ($black ? "#111!important" : "#777!important")};
    font-size: 1.4em!important;
  }

  background: ${({ $black }) => ($black ? "#111!important" : "grey!important")};

  border-top: 0.5em solid #777 !important;
  border-bottom: 0.5em solid #444 !important;
  border-left: 0.5em solid #555 !important;
  border-right: 0.5em solid #555 !important;
  outline: black solid 2px !important;

  padding: 0.1em !important;
  font-size: 1.5em !important;
  font-family: ${({ $black }) => ($black ? "Seven Segment" : "system-ui")};

  color: ${({ $active, disabled }) => {
    if (!disabled) {
      return $active ? "greenyellow" : "lightgreen";
    }
    return "lightgray";
  }};
  text-align: center !important;

  ${({ disabled }) =>
    disabled
      ? css`
          text-shadow: 0 0 0.5px lightgray, 0 0 1px lightgray, 0 0 1.5px gray,
            0 0 2px gray, 0 0 2.5px gray, 0 0 3px gray, 0 0 3.5px gray;
          pointer-events: none;
        `
      : css`
          text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen,
            0 0 1.5px darkgreen, 0 0 2px darkgreen, 0 0 2.5px darkgreen,
            0 0 3px darkgreen, 0 0 3.5px darkgreen;
        `}
`;
