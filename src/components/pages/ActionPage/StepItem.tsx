import {
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
import { useAction } from "context";
import { Command, Step } from "types/action/action";
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
  if (cmds.length === 0) return 0;

  const stepsCompleted = cmds.filter(
    (cmd) => cmd.status === Status.COMPLETED
  ).length;

  return (stepsCompleted / cmds.length) * 100;
};

const StepItem = ({ step }: StepItemProps): JSX.Element => {
  const { simpleMode } = useAction();

  const statusColor = getStatusColor(step.status);
  const commands = Object.values(step.commands).filter((cmd) => !cmd.hide);

  return (
    <div
      style={{
        marginBottom: commands.length === 0 ? (simpleMode ? 5 : 10) : 0,
      }}
    >
      <Paper elevation={3}>
        <ListItem sx={{ py: simpleMode ? 0.5 : 1 }}>
          <ListItemIcon>{getStatusIcon(step.status, true)}</ListItemIcon>

          <ListItemText>
            <Typography
              variant={simpleMode ? "subtitle2" : "h6"}
              sx={{ wordBreak: "break-word" }}
            >
              {step.label}
            </Typography>
          </ListItemText>
        </ListItem>

        <LinearProgress
          variant="determinate"
          value={computeStepProgress(step)}
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
            <CommandItem key={command.uuid} command={command} />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default StepItem;
