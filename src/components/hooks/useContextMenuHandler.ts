import { useEffect } from "react";

function contextMenuHandler(event: MouseEvent) {
  event.preventDefault();
  return false;
}

export function useContextMenuHandler() {
  useEffect(() => {
    document.addEventListener("contextmenu", contextMenuHandler, true);

    return () =>
      document.removeEventListener("contextmenu", contextMenuHandler);
  }, []);
}
