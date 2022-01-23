import { List, ListItemButton, Paper, Typography } from "@mui/material";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import ArrowDelimiter from "components/common/Separator/ArrowDelimiter";
import { useHistory } from "react-router";
import { RecentTasks } from "types/storage/task";

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
                    <ColoredCircle
                      color={task.task.taskType.color}
                      size={20}
                      marginRight={15}
                    />

                    {task.task.entity && (
                      <>
                        {task.task.entity.type === "Shot" &&
                          task.task.entity.sequence && (
                            <>
                              <Typography fontSize={14} color="text.disabled">
                                {task.task.entity.sequence.name}
                              </Typography>
                              <ArrowDelimiter />
                            </>
                          )}
                        <Typography fontSize={14} color="text.disabled">
                          {task.task.entity.name}
                        </Typography>
                        <ArrowDelimiter />
                      </>
                    )}

                    <Typography
                      sx={{
                        color: "rgb(231, 231, 231)",
                      }}
                    >
                      {task.task.taskType.name}
                    </Typography>

                    <ArrowDelimiter />

                    <Typography color="text.disabled">
                      {task.task.name}
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
