import DangerousIcon from "@mui/icons-material/Dangerous";
import FlagIcon from "@mui/icons-material/Flag";
import {
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  Paper,
  Stack,
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
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useHistory } from "react-router";
import { Action } from "types/action/action";
import { DCCContext } from "types/action/context";

import PageWrapper from "../PageWrapper/PageWrapper";

const DCCRow = ({ dcc }: { dcc: DCCContext }): JSX.Element => {
  const [killLoading, setKillLoading] = useState<boolean>();

  const { actions, isActionFinished, clearAction } = useAction();
  const history = useHistory();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const actionsForThisDcc = Object.values(actions).filter(
    (action) => action.context_metadata.uuid === dcc.uuid
  );

  const handleClearAction = (action: Action) => {
    uiSocket.emit("clearAction", { uuid: action.uuid }, () => {
      clearAction(action.uuid);
      enqueueSnackbar(`Cancelled action ${action.name}`, {
        variant: "warning",
      });
    });
  };

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
          {actionsForThisDcc.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {actionsForThisDcc.map((action) => (
                <Chip
                  key={action.uuid}
                  label={action.name}
                  variant="outlined"
                  color="success"
                  onClick={() => history.push(`/action/${action.uuid}`)}
                  onDelete={() => handleClearAction(action)}
                  deleteIcon={
                    isActionFinished[action.uuid] ? <FlagIcon /> : undefined
                  }
                />
              ))}
            </Stack>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell align="center">
          {killLoading ? (
            <CircularProgress color="error" size={20} sx={{ m: "7px" }} />
          ) : (
            <IconButton
              onClick={() => {
                setKillLoading(true);

                uiSocket.emit("killProcess", { pid: dcc.pid }, (response) => {
                  if (response.status === 200) {
                    enqueueSnackbar(response.msg, { variant: "success" });
                  } else {
                    enqueueSnackbar(
                      `Error ${response.status} when killing process: ${response.msg}`,
                      {
                        variant: "error",
                      }
                    );
                  }

                  setTimeout(() => setKillLoading(false), 500);
                });
              }}
            >
              <DangerousIcon color="error" />
            </IconButton>
          )}
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
            <TableCell>Running actions</TableCell>
            <TableCell align="center">Kill</TableCell>
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
    <PageWrapper title="Connected software" goBack>
      <div style={{ marginTop: "20px" }}>{content()}</div>
    </PageWrapper>
  );
};

export default DCCClientsPage;
