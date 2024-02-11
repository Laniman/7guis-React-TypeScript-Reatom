import React from "react";
import "./reset.css";
import { createRoot } from "react-dom/client";
import { reatomContext } from "@reatom/npm-react";
import { createCtx } from "@reatom/framework";
import { configure } from "mobx";
import { App } from "./app";
import "./css.css";

configure({
  enforceActions: "never",
});

const ctx = createCtx();

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <reatomContext.Provider value={ctx}>
      <App />
    </reatomContext.Provider>
  </React.StrictMode>,
);
