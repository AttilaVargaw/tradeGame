import { useEffect } from "react";

function keypressHandler({ code }: KeyboardEvent) {
  setTimeout(() => {
    switch (code) {
      case "NumpadAdd":
      case "NumpadSubtract":
        break;
      case "KeyW":
        break;
      case "KeyS":
        break;
      case "KeyA":
        break;
      case "KeyD":
        break;
    }
  }, 0);
}

export function useKeypressHandler() {
  useEffect(() => {
    window.addEventListener("keypress", keypressHandler);
    return () => window.removeEventListener("keypress", keypressHandler);
  });
}
