import {
  Box,
  Collapse,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import { useState } from "react";
import { Step } from "types/action/action";
import { Status } from "types/action/status";
import { getStatusColor, getStatusIcon } from "utils/status";

import CommandItem from "./CommandItem";

interface StepItemProps {
  step: Step;
}

/**
 * Computes the progress of a step from 0 to 100
 */
const computeStepProgress = (step: Step) => {
  const cmds = Object.values(step.commands);
  return (
    (cmds.filter((cmd) => cmd.status === Status.COMPLETED).length /
      cmds.length) *
    100
  );
};

const StepItem = ({ step }: StepItemProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(true);

  const stepProgress = computeStepProgress(step);
  const statusColor = getStatusColor(step.status);

  const commands = Object.values(step.commands).filter((cmd) => !cmd.hide);

  return (
    <Box sx={{ mb: 2 }}>
      <Paper elevation={3}>
        <ListItem onClick={() => setOpen(!open)}>
          <ListItemIcon>{getStatusIcon(step.status, true)}</ListItemIcon>

          <ListItemText>
            <Typography variant="h6">{step.label}</Typography>
          </ListItemText>
        </ListItem>

        <LinearProgress
          variant="determinate"
          value={stepProgress}
          sx={{
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: "background.paper",
            },
            [`& .${linearProgressClasses.bar}`]: {
              backgroundColor: statusColor,
            },
          }}
        />
      </Paper>

      {commands.length > 0 && (
        <Collapse
          in={
            step.status !== Status.INITIALIZED &&
            step.status !== Status.COMPLETED
          }
        >
          <List sx={{ pl: 4, py: 0 }}>
            {commands.map((command) => (
              <CommandItem command={command} key={command.uuid} />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default StepItem;
