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
      body={<>{String(error)}</>}
      header={header}
      footer={<Button onClick={resetErrorBoundary}>Retry</Button>}
      hideCloseButton
    />
  );
}
