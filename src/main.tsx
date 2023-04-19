import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";

import AppGlobalStyles from "~/style/AppGlobalStyles";
import { theme } from "~/style/theme";

import App from "./App";

/**
 * This is the entry point used by React to render the whole component hierarchy.
 * The StrictMode is only used in development for extra checks.
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* Does a CSS normalize */}
      <CssBaseline />

      {/* Apply global styles */}
      <AppGlobalStyles />

      {/* Render the whole app */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
