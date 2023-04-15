import { useEffect, useState } from "react";

export function useWindowSize() {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const eventHandler = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", eventHandler);

    return () => window.removeEventListener("resize", eventHandler);
  }, []);

  return { width, height };
}
