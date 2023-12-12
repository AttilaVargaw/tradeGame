import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorComponent } from "./ErrorComponent";

export function GameErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary FallbackComponent={ErrorComponent}>{children}</ErrorBoundary>
  );
}
