import { Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { TaskStatus } from "types/entities";

interface TaskStatusBadgeProps {
  taskStatus: TaskStatus;
  fontSize?: number;
  /** sx props passed to Typography */
  sx?: SxProps<Theme>;
}

/**
 * Status badge for tasks
 */
const TaskStatusBadge = ({
  fontSize,
  taskStatus,
  sx,
}: TaskStatusBadgeProps): JSX.Element => {
  return (
    <Typography
      fontSize={fontSize || 10}
      sx={{
        backgroundColor:
          taskStatus.color === "#f5f5f5" ? "text.disabled" : taskStatus.color,
        borderRadius: 5,
        px: 1,
        py: 0.5,
        ...sx,
      }}
    >
      {taskStatus.short_name.toUpperCase()}
    </Typography>
  );
};

export default TaskStatusBadge;
