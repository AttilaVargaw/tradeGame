import { useMemo } from "react";
import { FallbackProps } from "react-error-boundary";

import Modal from "../modals/Modal";
import { Button } from "./button";
import { Label } from "./label";

const header = (
  <Label color="red" type="painted">
    Error
  </Label>
);

export function ErrorComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Modal
      body={useMemo(
        () => (
          <>{String(error)}</>
        ),
        [error]
      )}
      header={header}
      footer={useMemo(
        () => (
          <Button onClick={resetErrorBoundary}>Retry</Button>
        ),
        [resetErrorBoundary]
      )}
      hideCloseButton
    />
  );
}
