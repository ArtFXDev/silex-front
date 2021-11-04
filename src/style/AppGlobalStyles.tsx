import { GlobalStyles } from "@mui/material";

const AppGlobalStyles = (): JSX.Element => (
  <GlobalStyles
    styles={{
      "html, body": {
        height: "100%",
        minHeight: "100%",
      },
      "#root": {
        height: "100%",
      },
      /* Customizing the scroll bar on Electron */
      "*::-webkit-scrollbar": {
        width: "8px",
      },
      "*::-webkit-scrollbar-track": {
        backgroundColor: "#323131",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "#545353" /* color of the scroll thumb */,
        borderRadius: "4px" /* roundness of the scroll thumb */,
        border: "2px solid #323131" /* creates padding around scroll thumb */,
      },
      "*::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#666565",
      },
    }}
  />
);

export default AppGlobalStyles;
