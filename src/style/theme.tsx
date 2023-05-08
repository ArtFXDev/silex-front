import { createTheme } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";

import KarrikRegularWoff2 from "~/assets/fonts/Karrik-Regular.woff2";

/**
 * This is where we modify the MUI theme colors
 */
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
    warning: {
      main: "#ffa726",
      dark: "#E68900",
    },
    error: {
      main: "#f44336",
      dark: "#e74c3c",
    },
  },
};

export const theme = createTheme({
  ...themeOptions,
  typography: {
    fontFamily: "Karrik",
  },
  components: {
    // Use a self hosted font
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Karrik';
          font-style: normal;
          font-display: swap;
          src: local('Karrik'), local('Karrik-Regular'), url(${KarrikRegularWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
    // Modify autofill color for form fields
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px rgba(100, 100, 100, 0.2) inset",
          },
        },
      },
    },
  },
});
