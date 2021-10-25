import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import AppGlobalStyles from "style/AppGlobalStyles";

import App from "./App";
import { theme } from "./style/theme";

/**
 * This is the entry point used by React to render the whole component hierarchy.
 * The StrictMode is only used in development for extra checks.
 */
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* Does a CSS normalize */}
      <CssBaseline />
      <AppGlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
