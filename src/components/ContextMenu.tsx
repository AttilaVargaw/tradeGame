import { FC, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Popover from "react-bootstrap/esm/Popover";
import {
  contextMenuObservable,
  ContextMenuItemProps,
  contextMenuPositionObservable,
} from "@Services/contextMenu";

export const ContextMenu: FC = () => {
  const [contextMenuItems, setContextMenuItems] = useState<
    ContextMenuItemProps[]
  >([]);
  const [contextMenuPositionState, setContextMenuPositionState] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    return contextMenuObservable.subscribe(setContextMenuItems).unsubscribe;
  }, []);

  useEffect(() => {
    return contextMenuPositionObservable.subscribe(setContextMenuPositionState)
      .unsubscribe;
  }, []);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function OutsideEventListener(ev: MouseEvent) {
      if (
        !popoverRef.current?.contains(ev.target as Node) &&
        contextMenuPositionState
      ) {
        setContextMenuPositionState(null);
      }
    }

    window.addEventListener("mousedown", OutsideEventListener);

    return () => window.removeEventListener("mousedown", OutsideEventListener);
  }, [contextMenuPositionState]);

  return (
    <Popover
      ref={popoverRef}
      hidden={!contextMenuPositionState}
      placement="right"
      id="popover-contained"
      style={{
        position: "absolute",
        top: contextMenuPositionState ? contextMenuPositionState[1] : 0,
        left: contextMenuPositionState ? contextMenuPositionState[0] : 0,
      }}
    >
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        {contextMenuItems.map(({ disabled, labelKey, onClick }) => (
          <Button key={labelKey} onClick={onClick} disabled={disabled}>
            {labelKey}
          </Button>
        ))}
      </Popover.Body>
    </Popover>
  );
};
