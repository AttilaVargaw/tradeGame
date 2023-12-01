import { PropsWithChildren, useCallback } from "react";
import styled, { css } from "styled-components";

export type ToggleProps = PropsWithChildren<{
  onChange?: (newValue: boolean) => void;
  onClick?: () => boolean;
  active: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  dangerouslySetInnerHTML?: { __html: string };
}>;

export function Toggle({
  onChange,
  active = false,
  children,
  disabled,
  style,
  dangerouslySetInnerHTML,
  onClick,
}: ToggleProps) {
  const onToggleClick = useCallback(() => {
    if (!disabled) {
      onChange?.(!active);
      onClick?.();
    }
  }, [active, disabled, onChange, onClick]);

  return (
    <ToggleBody
      style={style}
      disabled={disabled}
      $active={active}
      onClick={onToggleClick}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </ToggleBody>
  );
}

export const ToggleBody = styled.div<{
  $active?: boolean;
  disabled?: boolean;
}>`
  &:hover&:not([disabled]) {
    color: greenyellow !important;
    cursor: pointer !important;
  }

  box-sizing: border-box !important;
  height: 3rem !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;

  &:active&:not([disabled]) {
    border-top: 0.7em solid #444 !important;
    border-bottom: 0.7em solid #111 !important;
    border-left: 0.7em solid #222 !important;
    border-right: 0.7em solid #222 !important;
    background: #777 !important;
    font-size: 0.9em !important;
  }

  ${({ $active }) =>
    $active
      ? css`
          border-top: 0.7em solid #444 !important;
          border-bottom: 0.7em solid #111 !important;
          border-left: 0.7em solid #222 !important;
          border-right: 0.7em solid #222 !important;
          background: #777 !important;
          font-size: 0.9em !important;
        `
      : css`
          border-top: 0.5em solid #777 !important;
          border-bottom: 0.5em solid #444 !important;
          border-left: 0.5em solid #555 !important;
          border-right: 0.5em solid #555 !important;
          font-size: 1em !important;
        `}

  background: grey!important;

  outline: black solid 2px !important;

  padding: 0.1em !important;
  font-family: helvetica !important;

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
        `
      : css`
          text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen,
            0 0 1.5px darkgreen, 0 0 2px darkgreen, 0 0 2.5px darkgreen,
            0 0 3px darkgreen, 0 0 3.5px darkgreen;
        `}
`;
