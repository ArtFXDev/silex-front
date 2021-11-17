import CancelIcon from "@mui/icons-material/Cancel";
import FlagIcon from "@mui/icons-material/Flag";
import {
  Box,
  Button,
  Fade,
  IconButton,
  List,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAction, useSocket } from "context";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Action } from "types/action/action";
import { Status } from "types/action/status";
import { UIOnServerEvents } from "types/socket";
import { getStatusColor } from "utils/status";
import { capitalize } from "utils/string";

import PageWrapper from "../PageWrapper/PageWrapper";
import StepItem from "./StepItem";

/**
 * Returns true if any of the steps of the action is waiting for user input
 */
const someStepsAreWaitingForInput = (action: Action) =>
  Object.values(action.steps).some(
    (step) => step.status === Status.WAITING_FOR_RESPONSE
  );

const ActionPage = (): JSX.Element | null => {
  const [actionFinished, setActionFinished] = useState<boolean>(false);

  const { action, setAction } = useAction();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  // Received when the action is finished
  const onClearAction = useCallback<UIOnServerEvents["clearAction"]>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_data) => {
      // TODO: support multiple actions and use data.uuid
      setActionFinished(true);
    },
    []
  );

  // In case we received a new action, we reset the finish status
  const onActionQuery = useCallback<UIOnServerEvents["actionQuery"]>(
    (action) => {
      if (action.data) setActionFinished(false);
    },
    []
  );

  useEffect(() => {
    uiSocket.on("actionQuery", onActionQuery);
    uiSocket.on("clearAction", onClearAction);

    return () => {
      uiSocket.off("actionQuery", onActionQuery);
      uiSocket.off("clearAction", onClearAction);
    };
  }, [history, onActionQuery, onClearAction, setAction, uiSocket]);

  if (!action) {
    return (
      <PageWrapper title="Actions" goBack>
        <Typography color="text.disabled">
          You don{"'"}t have any running actions...
        </Typography>
      </PageWrapper>
    );
  }

  // Called when clicking on the submit button
  const handleClickOnAction = () => {
    // TODO: heck because we need to manually set the ask_user status to false
    for (const step of Object.values(action.steps)) {
      for (const cmd of Object.values(step.commands)) {
        if (cmd.status === Status.WAITING_FOR_RESPONSE) {
          // eslint-disable-next-line camelcase
          cmd.ask_user = false;
        }
      }
    }

    // Send the whole action object to the socket server
    uiSocket.emit("actionUpdate", action, (data) => {
      enqueueSnackbar(`Action ${action.name} sent (${data.status})`, {
        variant: "success",
      });
    });
  };

  return (
    <PageWrapper>
      <Box sx={{ maxWidth: 800 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <div>
            <Typography
              color="text.disabled"
              variant="h5"
              sx={{ display: "inline-block", mr: 2 }}
              display="inline-block"
            >
              Action:
            </Typography>

            <Typography variant="h4" display="inline-block" sx={{ mr: 3 }}>
              {capitalize(action.name)}
            </Typography>

            {actionFinished && (
              <Tooltip title="The action is finished" placement="top" arrow>
                <Typography
                  fontSize={30}
                  sx={{ cursor: "default", display: "inline-block" }}
                >
                  <FlagIcon
                    sx={{
                      // Get the color of the last step
                      color: getStatusColor(
                        Object.values(action.steps)
                          .reverse()
                          .find((a) => a.status !== Status.INITIALIZED)?.status
                      ),
                    }}
                  />
                </Typography>
              </Tooltip>
            )}
          </div>

          <Tooltip title="Cancel action" placement="top" arrow>
            <IconButton
              sx={{ ml: "auto" }}
              onClick={() => {
                history.goBack();

                uiSocket.emit("clearAction", { uuid: action.uuid }, () => {
                  setAction(undefined);

                  enqueueSnackbar(`Cancelled action ${action.name}`, {
                    variant: "error",
                  });
                });
              }}
            >
              <CancelIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>

        <List>
          {Object.values(action.steps)
            .filter((s) => !s.hide)
            .sort((a, b) => a.index - b.index)
            .map((step) => (
              <StepItem key={step.uuid} step={step} />
            ))}
        </List>

        <Fade in={someStepsAreWaitingForInput(action)}>
          <Button
            variant="contained"
            sx={{ position: "sticky", bottom: 30, left: 800 }}
            onClick={handleClickOnAction}
          >
            {action.name}
          </Button>
        </Fade>
      </Box>
    </PageWrapper>
  );
};

export default ActionPage;
