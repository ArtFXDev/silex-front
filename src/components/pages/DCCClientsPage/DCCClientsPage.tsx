import {
  Alert,
  AlertTitle,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useAction, useSocket } from "context";
import { DCCContext } from "types/action/context";

import PageWrapper from "../PageWrapper/PageWrapper";

const DCCRow = ({ dcc }: { dcc: DCCContext }): JSX.Element => {
  const { actions } = useAction();

  return (
    <Fade in timeout={400}>
      <TableRow>
        <TableCell>
          <DCCLogo name={dcc.dcc || "python"} sx={{ pl: 1, float: "left" }} />
        </TableCell>
        <TableCell>{dcc.pid || "-"}</TableCell>
        <TableCell>{dcc.project || "-"}</TableCell>
        <TableCell>{dcc.sequence || "-"}</TableCell>
        <TableCell>{dcc.shot || "-"}</TableCell>
        <TableCell>{dcc.task || "-"}</TableCell>
        <TableCell>
          {
            Object.values(actions).filter(
              (action) => action.context_metadata.uuid === dcc.uuid
            ).length
          }{" "}
          actions running...
        </TableCell>
      </TableRow>
    </Fade>
  );
};

const DCCClientsTable = ({
  dccClients,
}: {
  dccClients: DCCContext[];
}): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>DCC</TableCell>
            <TableCell>PID</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Sequence</TableCell>
            <TableCell>Shot</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dccClients.map((dcc) => dcc && <DCCRow dcc={dcc} key={dcc.uuid} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DCCClientsPage = (): JSX.Element => {
  const socket = useSocket();

  const content = () => {
    if (socket.isConnected) {
      return socket.dccClients.length !== 0 ? (
        <DCCClientsTable dccClients={socket.dccClients} />
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
    <PageWrapper title="Connected softwares" goBack>
      <div style={{ marginTop: "20px" }}>{content()}</div>
    </PageWrapper>
  );
};

export default DCCClientsPage;
