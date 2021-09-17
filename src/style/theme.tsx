import { createTheme, ThemeOptions } from "@material-ui/core/styles";

import CooperHewitt from "./fonts/CooperHewitt-Medium.otf";

const cooperHewitt = {
  fontFamily: "CooperHewitt",
  fontStyle: "normal",
  fontWeight: 400,
  src: `
    local('CooperHewitt'),
    local('CooperHewitt'),
    url(${CooperHewitt}) format('opentype')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

export const themeOptions: ThemeOptions = {
  palette: {
    type: "dark",
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
  // typography: {
  //   fontFamily: ['"Open Sans"', "CooperHewitt", "Roboto"].join(","),
  // },
  // overrides: {
  //   MuiCssBaseline: {
  //     "@global": {
  //       "@font-face": [cooperHewitt],
  //     },
  //   },
  // },
});
