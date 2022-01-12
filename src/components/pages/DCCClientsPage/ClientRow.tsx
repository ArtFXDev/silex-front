import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useAction, useSocket } from "context";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useHistory } from "react-router";
import { Action } from "types/action/action";
import { DCCContext } from "types/action/context";

interface ClientsRowProps {
  dcc: DCCContext;
}

const ClientRow = ({ dcc }: ClientsRowProps): JSX.Element => {
  const [killLoading, setKillLoading] = useState<boolean>();

  const { actions, clearAction } = useAction();
  const history = useHistory();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const actionsForThisDcc = Object.values(actions).filter(
    (action) => action.action.context_metadata.pid === dcc.pid
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
          <DCCLogo name={dcc.dcc} sx={{ pl: 1, float: "left" }} />
        </TableCell>
        <TableCell>{dcc.pid || "-"}</TableCell>
        <TableCell>{dcc.project || "-"}</TableCell>
        <TableCell>{dcc.sequence || "-"}</TableCell>
        <TableCell>{dcc.shot || "-"}</TableCell>
        <TableCell>{dcc.task || "-"}</TableCell>
        <TableCell>
          {actionsForThisDcc.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {actionsForThisDcc.map((actionObject) => {
                const { action } = actionObject;
                return (
                  <Chip
                    key={action.uuid}
                    label={action.name}
                    variant="outlined"
                    color="success"
                    onClick={() => history.push(`/action/${action.uuid}`)}
                    onDelete={() => handleClearAction(action)}
                  />
                );
              })}
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

export default ClientRow;
