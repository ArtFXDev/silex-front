import BugReportIcon from "@mui/icons-material/BugReport";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Box,
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
import { useState } from "react";
import { BORDER_RADIUS_BOTTOM, BORDER_RADIUS_TOP } from "style/constants";
import { Command } from "types/action/action";
import { Status } from "types/action/status";
import { getStatusColor, getStatusIcon } from "utils/status";

import ParameterItem from "./ParameterItem";

interface CommandItemProps {
  command: Command;
  disabled?: boolean;
}

const CommandItem = ({ command, disabled }: CommandItemProps): JSX.Element => {
  const [openLogs, setOpenLogs] = useState<boolean>();

  // Get parameters and delete hidden ones
  const parameters = Object.values(command.parameters).filter((p) => !p.hide);

  // The logs are only opened when processing, error or invalid state
  const openLogsBasedOnStatus =
    openLogs === undefined &&
    [Status.PROCESSING, Status.ERROR, Status.INVALID].includes(command.status);

  return (
    <Box sx={{ my: 2 }}>
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
          }}
          disabled={disabled}
          id={`cmd-${command.uuid}`}
        >
          <ListItemIcon>{getStatusIcon(command.status)}</ListItemIcon>

          <ListItemText>{command.label}</ListItemText>

          {command.tooltip && (
            <Tooltip title={command.tooltip} arrow>
              <HelpOutlineIcon color="disabled" />
            </Tooltip>
          )}

          {command.logs.length > 0 && (
            <Tooltip title="See logs" arrow placement="right">
              <IconButton
                sx={{
                  transition: "all 0.2s ease",
                  transform: `rotate(${
                    openLogs || openLogsBasedOnStatus ? -90 : 0
                  }deg)`,
                }}
                onClick={() =>
                  setOpenLogs(openLogsBasedOnStatus ? false : !openLogs)
                }
              >
                <BugReportIcon />
              </IconButton>
            </Tooltip>
          )}
        </ListItem>
      </Paper>

      {command.logs.length > 0 && (
        <Collapse in={openLogs}>
          <Logs
            logs={command.logs}
            regexp={
              /(\[SILEX\] {4}\[.+\]) ([A-Z ]{10})(\| {4}\[.+\]) (.{50,}) (\([0-9]+\))/g
            }
          />
        </Collapse>
      )}

      <Collapse in={command.status === Status.WAITING_FOR_RESPONSE}>
        {parameters.length > 0 && (
          <Paper elevation={2} sx={{ borderRadius: BORDER_RADIUS_BOTTOM }}>
            <List sx={{ px: 3 }}>
              {parameters.map((parameter, i) => (
                <div key={i}>
                  <ParameterItem parameter={parameter} />
                  {i !== parameters.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </Paper>
        )}
      </Collapse>
    </Box>
  );
};

export default CommandItem;
