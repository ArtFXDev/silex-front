import CancelIcon from "@mui/icons-material/Cancel";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
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
import { Action } from "types/action/action";
import { Status } from "types/action/status";
import { getStatusColor } from "utils/status";
import { capitalize } from "utils/string";

import StepItem from "./StepItem";

/**
 * Returns true if any of the steps of the action is waiting for user input
 */
const someStepsAreWaitingForInput = (action: Action) =>
  Object.values(action.steps).some(
    (step) => step.status === Status.WAITING_FOR_RESPONSE
  );

interface ActionItemProps {
  uuid: Action["uuid"];
}

const ActionItem = ({ uuid }: ActionItemProps): JSX.Element => {
  const { clearAction, actions, actionStatuses } = useAction();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const action = actions[uuid];
  const finished = actionStatuses[uuid];

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

  const handleClearAction = () => {
    if (!finished) {
      uiSocket.emit("clearAction", { uuid: action.uuid }, () => {
        clearAction(action.uuid);

        enqueueSnackbar(`Cancelled action ${action.name}`, {
          variant: "warning",
        });
      });
    } else {
      clearAction(action.uuid);
    }
  };

  return (
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

          {finished && (
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

        <Tooltip title={finished ? "Clean" : "Cancel"} placement="top" arrow>
          <IconButton sx={{ ml: "auto" }} onClick={handleClearAction}>
            {finished ? <DeleteSweepIcon /> : <CancelIcon fontSize="medium" />}
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
          disabled={finished}
        >
          {action.name}
        </Button>
      </Fade>
    </Box>
  );
};

export default ActionItem;
