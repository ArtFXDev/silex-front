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
import { Command, Step } from "types/action/action";
import { Status } from "types/action/status";
import { getStatusColor, getStatusIcon } from "utils/status";

import CommandItem from "./CommandItem";

interface StepItemProps {
  step: Step;
  disabled?: boolean;
  simplify?: boolean;
}

/**
 * Computes the progress of a step from 0 to 100
 */
const computeStepProgress = (step: Step) => {
  const cmds = Object.values(step.commands);
  if (cmds.length === 0) return 0;

  const stepsCompleted = cmds.filter(
    (cmd) => cmd.status === Status.COMPLETED
  ).length;

  return (stepsCompleted / cmds.length) * 100;
};

const StepItem = ({ step, disabled, simplify }: StepItemProps): JSX.Element => {
  const stepProgress = computeStepProgress(step);
  const statusColor = getStatusColor(step.status);

  const commands = Object.values(step.commands).filter((cmd) => !cmd.hide);

  return (
    <Box sx={{ mb: commands.length === 0 ? (simplify ? 0.5 : 1) : 0 }}>
      <Paper elevation={3}>
        <ListItem sx={{ py: simplify ? 0.5 : 1 }} disabled={disabled}>
          <ListItemIcon>{getStatusIcon(step.status, true)}</ListItemIcon>

          <ListItemText>
            <Typography
              variant={simplify ? "subtitle2" : "h6"}
              sx={{ wordBreak: "break-word" }}
            >
              {step.label}
            </Typography>
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

      <Collapse in={step.status !== Status.INITIALIZED} unmountOnExit>
        <List sx={{ pl: 4, py: 0 }}>
          {commands.map((command: Command) => (
            <CommandItem
              key={command.uuid}
              command={command}
              disabled={disabled}
              simplify={simplify}
            />
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default StepItem;
