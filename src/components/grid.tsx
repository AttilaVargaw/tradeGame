import styled, { css } from "styled-components";

export const GridItem = styled.div<{ $row?: number; $col?: number }>`
  ${({ $row }) =>
    $row
      ? css`
          grid-row: ${$row};
        `
      : ""};
  ${({ $col }) =>
    $col
      ? css`
          grid-column: ${$col};
        `
      : ""};
`;

export const Grid = styled.div<{ num: number }>`
  display: grid;
  grid-template-columns: repeat((${({ num }) => num}), 1fr);
`;
