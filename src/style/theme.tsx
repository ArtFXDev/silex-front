import { createTheme, ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#EE4E45",
    },
    secondary: {
      main: "#DC4C49",
    },
    background: {
      default: "#2c2b2b",
      paper: "#333232",
    },
  },
};

export const theme = createTheme({
  ...themeOptions,
});
