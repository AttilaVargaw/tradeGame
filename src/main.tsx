import "leaflet/dist/leaflet.css";

import "./index.scss";

import { createRoot } from "react-dom/client";

import App from "./app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  alert("No root element!");
} else {
  const root = createRoot(rootElement);

  root.render(<App />);
}
