import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlansProvider } from "./context/PlanContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <PlansProvider>
      <App />
    </PlansProvider>
  // </React.StrictMode>
);
