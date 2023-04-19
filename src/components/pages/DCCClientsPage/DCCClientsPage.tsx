import { Alert, AlertTitle, Typography } from "@mui/material";

import { useSocket } from "~/context";

import PageWrapper from "../PageWrapper/PageWrapper";
import ClientsTable from "./ClientsTable";

const DCCClientsPage = (): JSX.Element => {
  const socket = useSocket();

  const content = () => {
    if (socket.isConnected) {
      return socket.dccClients.length !== 0 ? (
        <ClientsTable clients={socket.dccClients} />
      ) : (
        <Typography color="text.disabled">No sofware connected...</Typography>
      );
    } else {
      return (
        <Alert severity="error">
          <AlertTitle>Connection error</AlertTitle>
          Can{"'"}t connect to the Silex WS server at{" "}
          {process.env.REACT_APP_WS_SERVER} —{" "}
          <strong>make sure it{"'"}s running or restart it</strong>
        </Alert>
      );
    }
  };

  return (
    <PageWrapper title="Connected software" goBack>
      <div style={{ marginTop: "20px" }}>{content()}</div>
    </PageWrapper>
  );
};

export default DCCClientsPage;
