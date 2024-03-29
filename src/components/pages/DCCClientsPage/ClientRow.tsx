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
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router";

import FileIcon from "~/components/common/FileIcon/FileIcon";
import { useAction, useSocket } from "~/context";
import { Action } from "~/types/action/action";
import { DCCContext } from "~/types/action/context";

interface ClientsRowProps {
  dcc: DCCContext;
}

const ClientRow = ({ dcc }: ClientsRowProps): JSX.Element => {
  const [killLoading, setKillLoading] = useState<boolean>();

  const { actions, clearAction } = useAction();
  const navigate = useNavigate();
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
          <FileIcon name={dcc.dcc || "python"} sx={{ pl: 1, float: "left" }} />
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
                    onClick={() => navigate(`/action/${action.uuid}`)}
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
