import { createTheme, DeprecatedThemeOptions } from "@mui/material/styles";

export const themeOptions: DeprecatedThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#DC4C49",
    },
    background: {
      default: "#383737",
    },
  },
};

export const theme = createTheme({
  ...themeOptions,
});
