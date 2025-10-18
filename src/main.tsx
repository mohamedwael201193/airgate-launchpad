import { AirGateProvider } from "@/air/useAirGate";
import { Web3Provider } from "@/providers/Web3Provider";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <AirGateProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AirGateProvider>
    </Web3Provider>
  </React.StrictMode>
);
