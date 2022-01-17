import BugReportIcon from "@mui/icons-material/BugReport";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import Logs from "components/common/Logs/Logs";
import { useAction } from "context";
import { useState } from "react";
import { BORDER_RADIUS_BOTTOM, BORDER_RADIUS_TOP } from "style/constants";
import { Command } from "types/action/action";
import { Status } from "types/action/status";
import { getStatusColor, getStatusIcon } from "utils/status";

import ParameterItem from "./ParameterItem";

interface CommandItemProps {
  command: Command;
}

/**
 * Represents a command, a command has parameters
 */
const CommandItem = ({ command }: CommandItemProps): JSX.Element => {
  const [openLogs, setOpenLogs] = useState<boolean>();

  const { simpleMode } = useAction();

  // Get parameters and delete hidden ones
  const parameters = Object.values(command.parameters).filter((p) => !p.hide);

  const shouldOpenLogs =
    openLogs ||
    (openLogs === undefined &&
      (command.status === Status.ERROR || command.status === Status.INVALID));

  return (
    <div style={{ margin: `${simpleMode ? 8 : 16}px 0` }}>
      {/* Header */}
      <Paper
        elevation={2}
        key={command.uuid}
        sx={{
          borderRadius: BORDER_RADIUS_TOP,
        }}
      >
        <ListItem
          sx={{
            borderRadius: BORDER_RADIUS_TOP,
            backgroundColor: getStatusColor(command.status),
            py: simpleMode ? 0.5 : 1,
            scrollMarginTop: "100px",
          }}
          disabled={command.skip}
          id={`cmd-${command.uuid}`}
        >
          <ListItemIcon>{getStatusIcon(command.status)}</ListItemIcon>

          <ListItemText
            primaryTypographyProps={{ fontSize: simpleMode ? 13 : 16 }}
          >
            {command.label}
          </ListItemText>

          {!simpleMode && command.tooltip && (
            <Tooltip title={command.tooltip} arrow placement="top">
              <HelpOutlineIcon color="disabled" sx={{ mr: "4px" }} />
            </Tooltip>
          )}

          {command.logs.length > 0 && (
            <Tooltip title="See logs" arrow placement="right">
              <IconButton
                sx={{
                  transition: "all 0.2s ease",
                  transform: `rotate(${shouldOpenLogs ? -90 : 0}deg)`,
                  fontSize: "50px",
                  p: "4px",
                  ml: 1,
                }}
                onClick={() => setOpenLogs(!shouldOpenLogs)}
              >
                <BugReportIcon style={{ fontSize: simpleMode ? 15 : 25 }} />
              </IconButton>
            </Tooltip>
          )}
        </ListItem>
      </Paper>

      {/* Logs */}
      {command.logs.length > 0 && (
        <Collapse in={shouldOpenLogs} unmountOnExit>
          <Logs
            logs={command.logs}
            regexp={
              /(\[SILEX\] {4}\[.+\]) ([A-Z ]{10})(\| {4}\[.+\]) (.{50,}) (\([0-9]+\))/g
            }
          />
        </Collapse>
      )}

      {/* Parameters */}
      <Collapse
        in={command.status === Status.WAITING_FOR_RESPONSE}
        unmountOnExit
      >
        {parameters.length > 0 && (
          <Paper elevation={2} sx={{ borderRadius: BORDER_RADIUS_BOTTOM }}>
            <List sx={{ px: 3 }}>
              {parameters.map((parameter, i) => (
                <>
                  <ParameterItem key={i} parameter={parameter} />
                  {i !== parameters.length - 1 && <Divider />}
                </>
              ))}
            </List>
          </Paper>
        )}
      </Collapse>
    </div>
  );
};

export default CommandItem;
