import { Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { TaskStatus } from "types/entities";

interface TaskStatusBadgeProps {
  taskStatus: TaskStatus;
  fontSize?: number;
  small?: boolean;

  /** sx props passed to Typography */
  sx?: SxProps<Theme>;
}

/**
 * Status badge for tasks
 */
const TaskStatusBadge = ({
  fontSize,
  taskStatus,
  small,
  sx,
}: TaskStatusBadgeProps): JSX.Element => {
  const name = taskStatus.short_name.toUpperCase();

  return (
    <Typography
      fontSize={fontSize || 10}
      sx={{
        backgroundColor:
          taskStatus.color === "#f5f5f5" ? "text.disabled" : taskStatus.color,
        borderRadius: small ? "50%" : 5,
        px: 1,
        py: small ? 0.3 : 0.5,
        ...sx,
      }}
    >
      {small ? name[0] : name}
    </Typography>
  );
};

export default TaskStatusBadge;
