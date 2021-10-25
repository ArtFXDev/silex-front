import { GlobalStyles } from "@mui/material";

const AppGlobalStyles = (): JSX.Element => (
  <GlobalStyles
    styles={{
      /* Customizing the scroll bar on Electron */
      "body::-webkit-scrollbar": {
        width: "8px",
      },
      "body::-webkit-scrollbar-track": {
        backgroundColor: "#323131",
      },
      "body::-webkit-scrollbar-thumb": {
        backgroundColor: "#545353" /* color of the scroll thumb */,
        borderRadius: "4px" /* roundness of the scroll thumb */,
        border: "2px solid #323131" /* creates padding around scroll thumb */,
      },
      "body::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#666565",
      },
    }}
  />
);

export default AppGlobalStyles;
