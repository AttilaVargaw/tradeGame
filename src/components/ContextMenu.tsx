import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { contextMenuObservable } from "@Services/contextMenu";

import { ContextMenuPosition } from "./hooks/useContextMenuPosition";
import { useObservableValue } from "./hooks/useObservable";
import { Link, TerminalScreen } from "./terminalScreen";

const Container = styled.div<{ $top: number; $left: number }>`
  position: absolute;
  left: ${({ $left }) => `${$left}px`};
  top: ${({ $top }) => `${$top}px`};
  z-index: 10000;
`;

export const ContextMenu: FC = () => {
  const contextMenuItems = useObservableValue(contextMenuObservable);

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
          {contextMenuItems?.map(({ disabled, labelKey, onClick }) => (
            <Link key={labelKey} onClick={onClick}>
              {labelKey}
            </Link>
          ))}
        </TerminalScreen>
      </Container>
    )
  );
};
