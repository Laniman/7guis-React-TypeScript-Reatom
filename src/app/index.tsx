import React from "react";
import "./reset.css";
import { createRoot } from "react-dom/client";
import { reatomContext } from "@reatom/npm-react";
import { App } from "./app";
import { ctx } from "./reatom";
import "./css.css";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No root element");

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <reatomContext.Provider value={ctx}>
      <App />
    </reatomContext.Provider>
  </React.StrictMode>,
);
