import { GlobalStyles } from "@mui/material";
import { darken } from "@mui/material/styles";

const AppGlobalStyles = (): JSX.Element => (
  <GlobalStyles
    styles={{
      "#root": {
        minHeight: "100vh",
      },
      /* Customizing the scroll bar on Electron */
      "::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "#323131",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#545353" /* color of the scroll thumb */,
        borderRadius: "4px" /* roundness of the scroll thumb */,
        border: "2px solid #323131" /* creates padding around scroll thumb */,
      },
      "::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#666565",
      },
      ".recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line":
        {
          stroke: "#999",
        },
      ".recharts-default-tooltip": {
        borderRadius: "10px",
        filter: "drop-shadow( 3px 3px 2px rgba(0, 0, 0, .2)) !important",
        fill: "#2c2b2b !important",
        backgroundColor: "#353B48 !important",
        borderColor: "#353B48 !important",
      },
      ".recharts-text.recharts-cartesian-axis-tick-value, .recharts-text.recharts-label":
        {
          fill: `${darken("#ccc", 0.2)} !important`,
        },
    }}
  />
);

export default AppGlobalStyles;
