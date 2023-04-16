import { FC, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Popover from "react-bootstrap/esm/Popover";
import {
  contextMenuObservable,
  ContextMenuItemProps,
  contextMenuPositionObservable,
} from "Services/contextMenu";

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

  return (
    <>
      {contextMenuPositionState && (
        <Popover
          hidden={!contextMenuPositionObservable}
          placement="right"
          id="popover-contained"
          style={{
            position: "absolute",
            top: contextMenuPositionState[1],
            left: contextMenuPositionState[0],
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
      )}
    </>
  );
};
