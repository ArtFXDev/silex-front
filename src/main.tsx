import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const root = document.getElementById("root") as HTMLElement;

/**
 * This is the entry point used by React to render the whole component hierarchy.
 * The StrictMode is only used in development for extra checks (warning: it does render twice the components)
 */
ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
