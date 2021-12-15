import { List, ListItemButton, Paper, Typography } from "@mui/material";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import { useHistory } from "react-router";
import { RecentTasks } from "types/storage/task";
import { formatDateTime } from "utils/date";

const RecentTasksList = (): JSX.Element => {
  const storedRecentTasks = window.localStorage.getItem("recent-tasks");

  const history = useHistory();

  const recentTasks: RecentTasks =
    storedRecentTasks && JSON.parse(storedRecentTasks);

  return (
    <div>
      <Typography sx={{ mb: 2 }}>Recent tasks:</Typography>

      {storedRecentTasks ? (
        <List sx={{ p: 0 }}>
          {Object.keys(recentTasks)
            .sort(
              (a, b) => recentTasks[b].lastAccess - recentTasks[a].lastAccess
            )
            .map((id) => {
              const task = recentTasks[id];

              return (
                <Paper key={id} sx={{ mb: 1 }}>
                  <ListItemButton onClick={() => history.push(task.pathname)}>
                    <ColoredCircle color={task.task.taskType.color} size={20} />
                    <Typography ml={1.5}>{task.task.taskType.name}</Typography>
                    <Typography ml={2} color="text.disabled">
                      {task.task.name}
                    </Typography>

                    <Typography fontSize={12} sx={{ ml: "auto" }}>
                      {formatDateTime(task.lastAccess)}
                    </Typography>
                  </ListItemButton>
                </Paper>
              );
            })}
        </List>
      ) : (
        <Typography color="text.disabled">No recent tasks...</Typography>
      )}
    </div>
  );
};

export default RecentTasksList;
