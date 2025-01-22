import "leaflet/dist/leaflet.css";

import "./src/index.scss";

import { createRoot } from "react-dom/client";

import App from "./src/app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  alert("No root element!");
} else {
  const root = createRoot(rootElement);

  root.render(<App />);
}
