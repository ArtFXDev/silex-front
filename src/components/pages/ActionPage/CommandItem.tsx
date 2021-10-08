import {
  Box,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
  Divider,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";

import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Command } from "types/action/action";
import { Status } from "types/action/status";
import ParameterItem from "./ParameterItem";
import { getStatusColor, getStatusIcon } from "utils/status";

interface CommandItemProps {
  command: Command;
}

const borderRadiusTop = `${LIST_ITEM_BORDER_RADIUS * 5}px ${
  LIST_ITEM_BORDER_RADIUS * 5
}px 0 0`;

const borderRadiusBottom = `0 0 ${LIST_ITEM_BORDER_RADIUS * 5}px ${
  LIST_ITEM_BORDER_RADIUS * 5
}px`;

const CommandItem = ({ command }: CommandItemProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(true);

  const parameters = Object.values(command.parameters);

  return (
    <Box sx={{ my: 2 }}>
      <Paper
        elevation={2}
        key={command.uuid}
        sx={{
          borderRadius: borderRadiusTop,
        }}
      >
        <ListItem
          sx={{
            borderRadius: borderRadiusTop,
            backgroundColor: getStatusColor(command.status),
            "&:hover": {
              backgroundColor:
                command.status === Status.COMPLETED ? "success.light" : "",
            },
          }}
          disabled={command.hide}
          onClick={() => setOpen(!open)}
        >
          <ListItemIcon>{getStatusIcon(command.status)}</ListItemIcon>

          <ListItemText>{command.label}</ListItemText>

          <Tooltip title={command.tooltip} arrow>
            <HelpOutlineIcon color="disabled" />
          </Tooltip>
        </ListItem>
      </Paper>

      <Collapse in={command.status === Status.WAITING_FOR_RESPONSE}>
        <Paper elevation={2} sx={{ borderRadius: borderRadiusBottom }}>
          <List sx={{ px: 3 }}>
            {parameters.map((parameter, i) => (
              <>
                <ParameterItem parameter={parameter} key={i} />
                {i !== parameters.length - 1 && <Divider />}
              </>
            ))}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default CommandItem;