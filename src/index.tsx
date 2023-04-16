import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.scss";
import "leaflet/dist/leaflet.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  alert("No root element!");
} else {
  const root = createRoot(rootElement);

  root.render(<App />);
}
