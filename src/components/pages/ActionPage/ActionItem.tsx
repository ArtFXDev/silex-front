import CancelIcon from "@mui/icons-material/Cancel";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
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
import {
  formatContextToString,
  someStepsAreWaitingForInput,
} from "utils/action";
import { capitalize } from "utils/string";

import StepItem from "./StepItem";

interface ActionItemProps {
  uuid: Action["uuid"];
  simplify?: boolean;
}

const ActionItem = ({ uuid, simplify }: ActionItemProps): JSX.Element => {
  const { clearAction, actions, actionStatuses } = useAction();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const action = actions[uuid];
  const finished = actionStatuses[uuid];

  // Called when clicking on the submit button
  const handleClickOnContinue = () => {
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

  // Cancel or clear the action
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

  const actionToSring = formatContextToString(action.context_metadata);

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ mb: simplify ? 1 : 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              {capitalize(action.label)}
            </Typography>
          </div>

          <Tooltip title={finished ? "Clean" : "Cancel"} placement="top" arrow>
            <IconButton sx={{ ml: "auto" }} onClick={handleClearAction}>
              {finished ? (
                <DeleteSweepIcon />
              ) : (
                <CancelIcon fontSize="medium" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Context subtitle */}
        {!simplify && actionToSring && (
          <Box sx={{ mt: 1 }}>
            <Typography
              color="text.disabled"
              fontSize={14}
              sx={{ opacity: 0.4 }}
            >
              ⤷ {actionToSring}
            </Typography>
          </Box>
        )}
      </Box>

      {/* List of steps */}
      <List sx={{ mb: 2 }}>
        {Object.values(action.steps)
          .filter((s) => !s.hide)
          .sort((a, b) => a.index - b.index)
          .map((step) => (
            <StepItem key={step.uuid} step={step} simplify={simplify} />
          ))}
      </List>

      {/* Continue button */}
      <Fade in={someStepsAreWaitingForInput(action)}>
        <Button
          variant="contained"
          sx={{ position: "sticky", bottom: 30, left: 800 }}
          onClick={handleClickOnContinue}
          disabled={finished}
        >
          Continue
        </Button>
      </Fade>
    </Box>
  );
};

export default ActionItem;
