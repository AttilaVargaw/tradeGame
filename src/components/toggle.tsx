import { PropsWithChildren, useCallback } from "react";
import styled, { css } from "styled-components";

export function Toggle({
  onChange,
  active = false,
  children,
}: PropsWithChildren<{
  onChange: (newValue: boolean) => void;
  active: boolean;
}>) {
  const onClick = useCallback(() => {
    onChange(!active);
  }, [active, onChange]);

  return (
    <ToggleBody active={active} onClick={onClick}>
      {children}
    </ToggleBody>
  );
}

export const ToggleBody = styled.div<{
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
    border-top: 0.7em solid #444;
    border-bottom: 0.7em solid #111;
    border-left: 0.7em solid #222;
    border-right: 0.7em solid #222;
    background: #777;
    font-size: 1.4em;
  }

  ${({ active }) =>
    active
      ? css`
          border-top: 0.7em solid #444;
          border-bottom: 0.7em solid #111;
          border-left: 0.7em solid #222;
          border-right: 0.7em solid #222;
          background: #777;
          font-size: 1.4em;
        `
      : css`
          border-top: 0.5em solid #777;
          border-bottom: 0.5em solid #444;
          border-left: 0.5em solid #555;
          border-right: 0.5em solid #555;
          font-size: 1.5em;
        `}

  background: grey;

  outline: black solid 2px;

  padding: 0.1em;
  font-family: system-ui;

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
