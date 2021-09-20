import { createTheme, ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(255,176,105)",
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
