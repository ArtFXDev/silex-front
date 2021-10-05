import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { gql, useQuery } from "@apollo/client";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Task } from "types";
import QueryWrapper from "components/QueryWrapper/QueryWrapper";
import LazyImage from "components/LazyImage/LazyImage";
import { PersonsAvatarGroup } from "components/avatar";
import { formatDateTime } from "utils/date";
import TaskStatusBadge from "components/TaskStatusBadge/TaskStatusBadge";

const TASK = gql`
  query getTask($id: ID!) {
    task(id: $id) {
      id
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
        name
      }

      taskStatus {
        short_name
        color
      }
    }
  }
`;

const TaskModal = (): JSX.Element => {
  const routeMatch = useRouteMatch<{ taskId: string }>();

  const history = useHistory();

  const onClose = () => {
    history.goBack();
  };

  const query = useQuery<{ task: Task }>(TASK, {
    variables: { id: routeMatch.params.taskId },
  });
  const { data } = query;

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: { bgcolor: "background.paper" },
        elevation: 3,
      }}
    >
      <QueryWrapper query={query}>
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
                <div>
                  <Typography color="text.disabled" component="span">
                    Task:
                  </Typography>{" "}
                  <Typography variant="h6" component="span">
                    {data.task.taskType.name}
                  </Typography>
                </div>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonsAvatarGroup
                    persons={data.task.assignees}
                    size={35}
                    fontSize={20}
                    sx={{ mr: 2 }}
                    fallbackMessage="No assignees yet..."
                  />

                  <TaskStatusBadge
                    taskStatus={data.task.taskStatus}
                    sx={{ mr: 2 }}
                    fontSize={15}
                  />

                  <IconButton onClick={onClose}>
                    <CloseIcon color="disabled" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container sx={{ p: 2 }}>
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
                  <LazyImage
                    width={248}
                    height={140}
                    alt="task image"
                    disableFade
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </QueryWrapper>
    </Dialog>
  );
};

export default TaskModal;
