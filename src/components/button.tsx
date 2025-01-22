import { PropsWithChildren } from "react";
import styled, { CSSProperties, css } from "styled-components";

export const ButtonBase = styled.div<{
  $black?: boolean;
  $active?: boolean;
  disabled?: boolean;
  red?: boolean;
  $size?: "normal" | "small";
}>`
  &:hover&:not([disabled]) {
    color: greenyellow !important;
    cursor: pointer !important;
  }

  box-sizing: border-box !important;
  height: ${({ $size }) => ($size === "normal" ? "3rem" : "2rem")}!important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;

  &:active&:not([disabled]) {
    border-top: 0.7em solid #444 !important;
    border-bottom: 0.7em solid #111 !important;
    border-left: 0.7em solid #222 !important;
    border-right: 0.7em solid #222 !important;
    background: ${({ $black }) =>
      $black ? "#111!important" : "#777!important"};
    font-size: 0.9em !important;
  }

  background: ${({ $black }) => ($black ? "#111!important" : "grey!important")};

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

  outline: black solid 2px !important;

  padding: 0.1em !important;
  font-family: ${({ $black }) => ($black ? "Seven Segment" : "helvetica")};

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

export type ButtonProps = PropsWithChildren<{
  active?: boolean;
  black?: boolean;
  size?: "normal" | "small";
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}>;

export const Button = ({
  active,
  black,
  size,
  onClick,
  disabled,
  ...props
}: ButtonProps) => {
  const onClick2 = () => !disabled && onClick?.();

  return (
    <ButtonBase
      {...props}
      $active={active}
      $black={black}
      onClick={onClick2}
      $size={size}
      disabled={disabled}
    />
  );
};
