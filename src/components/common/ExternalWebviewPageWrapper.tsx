import { Alert } from "@mui/material";
import isElectron from "is-electron";

import PageWrapper from "~/components/pages/PageWrapper/PageWrapper";

interface ExternalPageWrapperProps {
  title: string;
  url: string;
}

const ExternalWebviewPageWrapper = ({
  title,
  url,
}: ExternalPageWrapperProps): JSX.Element => {
  return (
    <PageWrapper title={title} goBack fullHeight>
      {isElectron() ? (
        url === "" ? (
          <Alert severity="warning">
            Page not configured!
            <br />
            You need to provide a valid url.
          </Alert>
        ) : (
          <webview
            src={url}
            style={{ width: "100%", height: "100%", border: "0px" }}
          />
        )
      ) : (
        <Alert severity="error">
          The web app is not running inside Electron, can{"'"}t use webview.
        </Alert>
      )}
    </PageWrapper>
  );
};

export default ExternalWebviewPageWrapper;
