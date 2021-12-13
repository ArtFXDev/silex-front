import { gql, useApolloClient, useQuery } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { PersonsAvatarGroup } from "components/common/avatar";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import LazyMedia from "components/utils/LazyMedia/LazyMedia";
import { useAuth } from "context";
import { forwardRef, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Task } from "types/entities";
import { RecentTasks } from "types/storage/task";
import { formatDateTime } from "utils/date";
import { entityURLAndExtension } from "utils/entity";
import {
  assignUserToTask,
  clearAssignation,
  originalPreviewFileURL,
} from "utils/zou";

import FileExplorer from "./FileExplorer";

const TASK = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      name
      created_at
      updated_at
      description
      type

      assignees {
        id
        full_name
        has_avatar
      }

      taskType {
        id
        name
        priority
        color
      }

      taskStatus {
        id
        short_name
        color
      }

      previews {
        id
        extension
      }
    }
  }
`;

/**
 * Taken from https://mui.com/components/dialogs/#transitions
 */
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade in ref={ref} {...props} timeout={500} />;
});

const TaskModal = (): JSX.Element => {
  const [zoomPreview, setZoomPreview] = useState<boolean>(false);
  const routeMatch = useRouteMatch<{ taskId: string }>();

  const history = useHistory();
  const { user } = useAuth();
  const client = useApolloClient();

  const onClose = () => {
    history.push(window.location.pathname.split("/").slice(0, -1).join("/"));
  };

  const query = useQuery<{ task: Task }>(TASK, {
    variables: { id: routeMatch.params.taskId },
  });
  const { data } = query;

  const currentUserAssignedToTask =
    data && data.task.assignees.some((p) => p.id === user?.id);

  // Store the current task in the local storage to have an history of recent tasks
  useEffect(() => {
    if (data) {
      const storedRecentTasks = window.localStorage.getItem("recent-tasks");
      const newTask = {
        pathname: window.location.pathname,
        lastAccess: Date.now(),
        task: data.task,
      };
      let recentTasks: RecentTasks = {};

      if (storedRecentTasks) {
        recentTasks = JSON.parse(storedRecentTasks);

        // Limit the number of recent tasks to 5
        if (
          Object.keys(recentTasks).length >= 5 &&
          !recentTasks[data.task.id]
        ) {
          // Sort them by last access time
          const sortedTasks = Object.keys(recentTasks).sort(
            (a, b) => recentTasks[b].lastAccess - recentTasks[a].lastAccess
          );

          // Remove the oldest one
          delete recentTasks[sortedTasks[sortedTasks.length - 1]];
        }
      }

      // Add the current task
      recentTasks[data.task.id] = newTask;

      // Save it to local storage
      window.localStorage.setItem("recent-tasks", JSON.stringify(recentTasks));
    }
  }, [data]);

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      TransitionComponent={Transition}
      PaperProps={{
        sx: { bgcolor: "background.paper", height: "80%" },
        elevation: 3,
      }}
    >
      {data && (
        <>
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <Typography color="text.disabled">Task:</Typography>

                  <Typography variant="h6" ml={1}>
                    {data.task.taskType.name}
                  </Typography>
                </div>

                <ColoredCircle
                  size={22}
                  color={data.task.taskType.color}
                  marginLeft={10}
                />

                <Typography
                  variant="h6"
                  ml={1.5}
                  component="span"
                  color="text.disabled"
                >
                  {data.task.name}
                </Typography>
              </div>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip
                  title={
                    !currentUserAssignedToTask
                      ? "Assign yourself"
                      : "Clear assignation"
                  }
                  placement="top"
                  arrow
                >
                  <IconButton
                    sx={{ mr: 1 }}
                    onClick={() => {
                      (!currentUserAssignedToTask
                        ? assignUserToTask(user?.id as string, data.task.id)
                        : clearAssignation(user?.id as string, data.task.id)
                      ).then(() =>
                        client.refetchQueries({ include: "active" })
                      );
                    }}
                  >
                    {!currentUserAssignedToTask ? (
                      <PersonAddIcon />
                    ) : (
                      <PersonAddDisabledIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <PersonsAvatarGroup
                  persons={data.task.assignees}
                  size={35}
                  fontSize={20}
                  sx={{ mr: 2 }}
                  fallbackMessage="No assignees yet..."
                />

                <IconButton onClick={onClose}>
                  <CloseIcon color="disabled" />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{ height: "100%" }}>
            <Grid container sx={{ p: 2 }} spacing={5}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  <Typography color="text.disabled">Created at:</Typography>{" "}
                  {formatDateTime(data.task.created_at)}
                </Typography>

                <Typography variant="subtitle1">
                  <Typography color="text.disabled">Updated at:</Typography>{" "}
                  {formatDateTime(data.task.updated_at)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ float: "right", position: "relative" }}>
                  <LazyMedia
                    src={entityURLAndExtension(data.task)}
                    width={248}
                    height={140}
                    alt="task image"
                    disableFade
                  />

                  {data.task.previews.length >= 1 && (
                    <IconButton
                      sx={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => setZoomPreview(true)}
                    >
                      <ZoomInIcon />
                    </IconButton>
                  )}

                  {zoomPreview && (
                    <Dialog open onClose={() => setZoomPreview(false)}>
                      <img
                        src={originalPreviewFileURL(
                          data.task.previews[0].id,
                          "pictures"
                        )}
                      />
                    </Dialog>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FileExplorer taskId={data.task.id} />
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default TaskModal;
