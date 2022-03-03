import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import {
  Button,
  Fade,
  IconButton,
  List,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAction, useSocket } from "context";
import isElectron from "is-electron";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { Action } from "types/action/action";
import {
  formatContextToString,
  someStepsAreWaitingForInput,
} from "utils/action";
import { capitalize } from "utils/string";

import StepItem from "./StepItem";

interface ActionItemProps {
  uuid: Action["uuid"];
}

/**
 * Represents a single action, an action has steps
 */
const ActionItem = ({ uuid }: ActionItemProps): JSX.Element => {
  const {
    clearAction,
    actions,
    sendActionUpdate,
    isActionFinished,
    simpleMode,
  } = useAction();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  // Get the action
  const { action } = actions[uuid];
  const finished = isActionFinished(action);
  const actionToSring = formatContextToString(action.context_metadata);

  const handleContinue = () => {
    sendActionUpdate(uuid, true, (data) => {
      const message =
        data.status === 200
          ? `Continue ${action.name} sent`
          : `Failed to send update ${action.name}`;

      enqueueSnackbar(message, {
        variant: data.status === 200 ? "success" : "error",
      });
    });
  };

  // Register the Enter key to continue the action
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        document.activeElement === document.body &&
        (e.code === "Enter" || e.code === "NumpadEnter")
      ) {
        handleContinue();
      }
    };

    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  });

  // Cancel or clear the action
  const handleClearAction = () => {
    uiSocket.emit("clearAction", { uuid: action.uuid }, () => {
      clearAction(action.uuid);
    });
  };

  /*const handleUndoLastCommand = () => {
    if (!finished) {
      uiSocket.emit("undoLastCommand", { uuid: action.uuid }, (response) => {
        enqueueSnackbar(`Undo last command`, {
          variant: response.status === 200 ? "success" : "error",
        });
      });
    }
  };*/

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: simpleMode ? 10 : 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
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
        </div>

        {/* Context subtitle */}
        {!simpleMode && actionToSring && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
            <Typography
              color="text.disabled"
              fontSize={14}
              sx={{ opacity: 0.4 }}
            >
              ⤷ {actionToSring}
            </Typography>

            <ContentCopyIcon
              sx={{
                fontSize: "18px",
                ml: 2,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  fill: "rgba(255, 255, 255, 0.6)",
                },
              }}
              color="disabled"
              onClick={() => {
                if (isElectron()) {
                  if (isElectron()) {
                    window.electron.send("clipboardWriteText", action.uuid);
                  } else {
                    navigator.clipboard.writeText(action.uuid);
                  }

                  enqueueSnackbar(`Copied action to clipboard`, {
                    variant: "success",
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      {/* List of steps */}
      <List sx={{ mb: 2 }}>
        {Object.values(action.steps)
          .filter((s) => !s.hide)
          .sort((a, b) => a.index - b.index)
          .map((step) => (
            <StepItem key={step.uuid} step={step} />
          ))}
      </List>

      {/* Continue button */}
      <Fade in={someStepsAreWaitingForInput(action)}>
        <div
          style={{
            display: "initial",
            position: "sticky",
            bottom: 30,
            left: 800,
          }}
        >
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
          >
            {/* <Tooltip title="Undo last command" placement="top" arrow>
              <IconButton onClick={handleUndoLastCommand}>
                <FirstPageIcon
                  color="disabled"
                  sx={{
                    transition: "all 0.2s ease",
                    "&:hover": { color: "rgb(180, 180, 180)" },
                  }}
                />
              </IconButton>
            </Tooltip> */}
            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={finished}
            >
              Continue
            </Button>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default ActionItem;
