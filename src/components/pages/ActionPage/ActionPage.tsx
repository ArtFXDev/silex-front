import CancelIcon from "@mui/icons-material/Cancel";
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

  const onClearAction = useCallback<UIOnServerEvents["clearAction"]>(
    (_data) => {
      // TODO: support multiple actions and use data.uuid
      setActionFinished(true);
    },
    []
  );

  const onActionQuery = useCallback<UIOnServerEvents["actionQuery"]>(
    (action) => {
      if (action.data) setActionFinished(false);
    },
    []
  );

  useEffect(() => {
    uiSocket.on("actionQuery", onActionQuery);
    uiSocket.on("clearAction", onClearAction);

    // Clear the current action on route change
    const unlisten = history.listen(() => {
      setAction(undefined);
    });

    return () => {
      unlisten();
      uiSocket.off("actionQuery", onActionQuery);
      uiSocket.off("clearAction", onClearAction);
    };
  }, [history, onActionQuery, onClearAction, setAction, uiSocket]);

  if (!action) return null;

  const handleClickOnAction = () => {
    // TODO: hack
    for (const step of Object.values(action.steps)) {
      for (const cmd of Object.values(step.commands)) {
        if (cmd.status === Status.WAITING_FOR_RESPONSE) {
          // eslint-disable-next-line camelcase
          cmd.ask_user = false;
        }
      }
    }

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
                  🏁
                </Typography>
              </Tooltip>
            )}
          </div>

          <Tooltip title="Cancel action" placement="top" arrow>
            <IconButton
              sx={{ ml: "auto" }}
              onClick={() => {
                history.goBack();
                enqueueSnackbar(`Cancelled action ${action.name}`, {
                  variant: "error",
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
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleClickOnAction();
            }}
          >
            {action.name}
          </Button>
        </Fade>
      </Box>
    </PageWrapper>
  );
};

export default ActionPage;
