import { createRoot } from 'react-dom/client'
import App from "./app"
import './index.scss'
import 'leaflet/dist/leaflet.css'

const root = createRoot(document.getElementById("root")!)

root.render(<App />)
