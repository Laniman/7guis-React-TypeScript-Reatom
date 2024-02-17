import React from "react";
import "./reset.css";
import { createRoot } from "react-dom/client";
import { reatomContext } from "@reatom/npm-react";
import { configure } from "mobx";
import { App } from "./app";
import { ctx } from "./reatom";
import "./css.css";

configure({
  enforceActions: "never",
});

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <reatomContext.Provider value={ctx}>
      <App />
    </reatomContext.Provider>
  </React.StrictMode>,
);
