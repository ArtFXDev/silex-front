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

import { useSocket } from "context";
import DCCLogo from "components/DCCLogo/DCCLogo";
import PageWrapper from "../PageWrapper/PageWrapper";
import { DCCClient } from "types/socket";

const DCCRow: React.FC<{ dcc: DCCClient }> = ({ dcc }) => (
  <Fade in timeout={400}>
    <TableRow>
      <TableCell>
        <DCCLogo name={dcc.dcc} sx={{ pl: 1 }} />
      </TableCell>
      <TableCell>{dcc.pid}</TableCell>
      <TableCell>{dcc.project}</TableCell>
      <TableCell>{dcc.sequence}</TableCell>
      <TableCell>{dcc.shot}</TableCell>
      <TableCell>{dcc.task}</TableCell>
    </TableRow>
  </Fade>
);

const DCCClientsTable: React.FC<{ dccClients: DCCClient[] }> = ({
  dccClients,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="justify">DCC</TableCell>
            <TableCell>PID</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Sequence</TableCell>
            <TableCell>Shot</TableCell>
            <TableCell>Task</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dccClients.map((dcc) => dcc && <DCCRow dcc={dcc} key={dcc.uuid} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DCCClientsPage: React.FC = () => {
  const socket = useSocket();

  return (
    <PageWrapper title="Connected dccs">
      <>
        {!socket.isConnected && (
          <Alert severity="error">
            <AlertTitle>Connection error</AlertTitle>
            Can{"'"}t connect to the Silex WS server at{" "}
            {process.env.REACT_APP_WS_SERVER} —{" "}
            <strong>make sure it{"'"}s running or restart it</strong>
          </Alert>
        )}

        {socket.dccClients.length !== 0 ? (
          <DCCClientsTable dccClients={socket.dccClients} />
        ) : (
          <Typography color="text.disabled">No dccs connected...</Typography>
        )}
      </>
    </PageWrapper>
  );
};

export default DCCClientsPage;
