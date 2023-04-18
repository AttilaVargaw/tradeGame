import styled, { css } from "styled-components";

export type styles = "led" | "painted";

export const Label = styled.div<{ type?: styles }>`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-inline: 1em;

  ${({ type }) => {
    if (type === "led")
      return css`
        color: lightgreen;
        background: #111;
        border: 2px solid grey;

        text-shadow: 0 0 0.5px lightgreen, 0 0 1px lightgreen,
          0 0 1.5px darkgreen, 0 0 2px darkgreen, 0 0 2.5px darkgreen,
          0 0 3px darkgreen, 0 0 3.5px darkgreen;

        font-family: "Seven Segment";
        border-radius: 0.5em;
      `;
    else if (type === "painted")
      return css`
        font: bold 200px arial, sans-serif;
        background-color: black;
        color: transparent;
        text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
        -webkit-background-clip: text;
        -moz-background-clip: text;
        background-clip: text;
      `;

    return "";
  }}

  text-align: center;
  font-size: 1.5em;
`;
