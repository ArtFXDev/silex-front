import { Typography } from "@mui/material";
import { TaskStatus } from "types";

interface TaskStatusBadgeProps {
  taskStatus: TaskStatus;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ taskStatus }) => {
  return (
    <Typography
      fontSize={10}
      sx={{
        backgroundColor:
          taskStatus.color === "#f5f5f5" ? "text.disabled" : taskStatus.color,
        borderRadius: 5,
        px: 1,
        py: 0.5,
      }}
    >
      {taskStatus.short_name.toUpperCase()}
    </Typography>
  );
};

export default TaskStatusBadge;
