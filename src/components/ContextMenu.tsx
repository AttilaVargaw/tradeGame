import { FC, useEffect, useRef, useState } from "react";
import {
  contextMenuObservable,
  ContextMenuItemProps,
} from "@Services/contextMenu";
import { useContextMenuPosition } from "./hooks/useContextMenuPosition";
import { Link, TerminalScreen } from "./terminalScreen";
import styled, { css } from "styled-components";

const Container = styled.div<{ top: number; left: number }>`
  position: absolute;
  left: ${({ left }) => `${left}px`};
  top: ${({ top }) => `${top}px`};
  z-index: 10000;
`;

export const ContextMenu: FC = () => {
  const [contextMenuItems, setContextMenuItems] = useState<
    ContextMenuItemProps[]
  >([]);

  const [contextMenuPosition, setContextMenuPosition] =
    useContextMenuPosition();

  useEffect(() => {
    return contextMenuObservable.subscribe(setContextMenuItems).unsubscribe;
  }, []);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function OutsideEventListener(ev: MouseEvent) {
      if (!popoverRef.current?.contains(ev.target as Node)) {
        setContextMenuPosition(null);
      }
    }

    window.addEventListener("mousedown", OutsideEventListener);

    return () => window.removeEventListener("mousedown", OutsideEventListener);
  }, [setContextMenuPosition]);

  console.log(contextMenuPosition);

  return (
    contextMenuPosition && (
      <Container
        ref={popoverRef}
        top={contextMenuPosition[1]}
        left={contextMenuPosition[0]}
      >
        <TerminalScreen>
          {contextMenuItems.map(({ disabled, labelKey, onClick }) => (
            <div key={labelKey}>
              <Link onClick={onClick}>{labelKey}</Link>
            </div>
          ))}
        </TerminalScreen>
      </Container>
    )
  );
};
