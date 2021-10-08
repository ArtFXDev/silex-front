import { createTheme, ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#EE4E45",
    },
    secondary: {
      main: "#b0b0b0",
    },
    background: {
      default: "#2c2b2b",
      paper: "#333232",
    },
    success: {
      main: "#66BB6A",
      dark: "#3B825D",
      light: "#4CA778",
    },
    info: {
      main: "#4D7D98",
    },
  },
};

export const theme = createTheme({
  ...themeOptions,
});
