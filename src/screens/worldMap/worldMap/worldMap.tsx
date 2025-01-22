import { MouseEventHandler } from "react";
import styled from "styled-components";

import { ModalRouter } from "@Components/ModalRouter";
import {
  ContextMenuPosition,
  useContextMenuHandler,
  useCurrentConvoy,
  useCurrentSelectedCities,
  useCurrentSelectedCity,
  useKeypressHandler,
  useWindowSize,
} from "@Hooks/index";

import SideMenu from "../../SideMenu/sideMenu";
import { GameMap } from "./GameMap";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

export function WorldMap(): React.ReactElement {
  useKeypressHandler();
  useContextMenuHandler();

  const { height, width } = useWindowSize();

  const menuWidth = width * 0.18;
  const mapWidth = width * 0.82;

  const sideMenuStyle = { height: height, width: menuWidth, top: 0 };
  const [currentConvoy] = useCurrentConvoy();
  const [currentSelectedCity] = useCurrentSelectedCity();
  const [currentSelectedCities] = useCurrentSelectedCities();

  const onContextMenu: MouseEventHandler = (event) => {
    if (!currentConvoy && !currentSelectedCity && currentSelectedCities) {
      ContextMenuPosition.next([event.clientX, event.clientY]);
    }
  };

  return (
    <Container>
      <PageContainer
        onContextMenu={onContextMenu}
        height={height}
        width={mapWidth}
      >
        <GameMap />
        <SideMenu style={sideMenuStyle} />
        <ModalRouter />
      </PageContainer>
    </Container>
  );
}
