import { MouseEventHandler, useCallback, useMemo } from "react";
import SideMenu from "../sideMenu";
import { useWindowSize } from "../../../components/hooks/useWIndowSize";
import { ModalRouter } from "@Components/ModalRouter";
import styled from "styled-components";
import { useKeypressHandler } from "@Components/hooks/useKeypressHandler";
import { useContextMenuHandler } from "@Components/hooks/useContextMenuHandler";
import { GameMap } from "./GameMap";
import { ContextMenuPosition } from "@Components/hooks/useContextMenuPosition";
import { useCurrentConvoy } from "@Components/hooks/useCurrentConvoy";
import { useCurrentSelectedCity } from "@Components/hooks/useCurrentSelectedCity";
import { useCurrentSelectedCities } from "@Components/hooks/useSelectedCities";


const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

export function WorldMap(): JSX.Element {
  useKeypressHandler();
  useContextMenuHandler();

  const { height, width } = useWindowSize();

  const menuWidth = useMemo(() => `${width * 0.18}px`, [width]);
  const mapWidth = useMemo(() => width * 0.82, [width]);

  const sideMenuStyle = useMemo(
    () => ({ height: height, width: menuWidth, top: 0 }),
    [menuWidth, height]
  );

  const [currentConvoy] = useCurrentConvoy();
  const [currentSelectedCity] = useCurrentSelectedCity();
  const [currentSelectedCities] = useCurrentSelectedCities();

  const onContextMenu = useCallback<MouseEventHandler>(
    (event) => {
      if (!currentConvoy && !currentSelectedCity && currentSelectedCities) {
        ContextMenuPosition.next([event.clientX, event.clientY]);
      }
    },
    [currentConvoy, currentSelectedCities, currentSelectedCity]
  );

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
