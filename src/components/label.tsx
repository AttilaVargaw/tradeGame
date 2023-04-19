import styled, { css } from "styled-components";

export type styles = "led" | "painted";

export const Container = styled.div<{ type?: styles }>`
  padding: 0.5em;
  display: flex;
  flex-direction: row;
  width: max-content;
  height: min-content;
  margin: 0.2em;

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
        justify-content: end;
      `;
    else if (type === "painted")
      return css`
        font: bold 200px arial, sans-serif;
        color: whitesmoke;
        background: black;
        -webkit-text-stroke: 1px grey;
        border: 0.1em solid white;
        justify-content: center;
        // -webkit-text-fill-color: white;
      `;

    return "";
  }}

  text-align: center;
  font-size: 1.5em;
`;

export function Label({
  children,
  type,
  ...props
}: {
  type?: styles;
  style?: React.CSSProperties;
  children: string | number;
}) {
  return (
    <Container type={type} {...props}>
      {type === "led"
        ? [...children.toString()].map((c, i) => (
            <div style={{ width: "0.6em" }} key={i}>
              {c}
            </div>
          ))
        : children}
    </Container>
  );
}
