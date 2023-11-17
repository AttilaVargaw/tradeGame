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

export const Table = styled.table``;
export const Tr = styled.tr``;
export const Td = styled.td``;
export const Th = styled.th``;
