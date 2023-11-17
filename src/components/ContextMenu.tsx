import { FC, useEffect, useRef, useState } from "react";
import {
  contextMenuObservable,
  ContextMenuItemProps,
} from "@Services/contextMenu";
import { Link, TerminalScreen } from "./terminalScreen";
import styled from "styled-components";
import { ContextMenuPosition } from "./hooks/useContextMenuPosition";

const Container = styled.div<{ $top: number; $left: number }>`
  position: absolute;
  left: ${({ $left }) => `${$left}px`};
  top: ${({ $top }) => `${$top}px`};
  z-index: 10000;
`;

export const ContextMenu: FC = () => {
  const [contextMenuItems, setContextMenuItems] = useState<
    ContextMenuItemProps[]
  >([]);

  useEffect(() => {
    return contextMenuObservable.subscribe(setContextMenuItems).unsubscribe;
  }, []);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function OutsideEventListener(ev: MouseEvent) {
      if (!popoverRef.current?.contains(ev.target as Node)) {
        ContextMenuPosition.next(null);
      }
    }

    const contextMenuPositonSubscription = ContextMenuPosition.subscribe(
      setContextMenuPositionState
    );

    window.addEventListener("mousedown", OutsideEventListener);

    return () => {
      window.removeEventListener("mousedown", OutsideEventListener);
      contextMenuPositonSubscription.unsubscribe();
    };
  }, []);

  const [contextMenuPositionState, setContextMenuPositionState] = useState<
    [number, number] | null
  >(null);

  return (
    contextMenuPositionState && (
      <Container
        ref={popoverRef}
        $top={contextMenuPositionState[1]}
        $left={contextMenuPositionState[0]}
      >
        <TerminalScreen>
          {contextMenuItems.map(({ disabled, labelKey, onClick }) => (
            <Link key={labelKey} onClick={onClick}>
              {labelKey}
            </Link>
          ))}
        </TerminalScreen>
      </Container>
    )
  );
};
