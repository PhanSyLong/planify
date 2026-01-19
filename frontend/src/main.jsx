import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PlanProvider } from "./components/context/PlanContext";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlanProvider>
        <App />
    </PlanProvider>
  </StrictMode>,
)
