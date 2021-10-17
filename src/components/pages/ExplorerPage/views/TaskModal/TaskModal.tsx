import { gql, useQuery } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { PersonsAvatarGroup } from "components/common/avatar";
import TaskStatusBadge from "components/common/TaskStatusBadge/TaskStatusBadge";
import LazyImage from "components/utils/LazyImage/LazyImage";
import { forwardRef } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Task } from "types/entities";
import { formatDateTime } from "utils/date";
import { entityPreviewURL } from "utils/entity";

import SceneList from "./SceneList";

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

      previews {
        id
      }
    }
  }
`;

/**
 * Taken from https://mui.com/components/dialogs/#transitions
 */
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children?: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Fade in ref={ref} {...props} timeout={500} />;
});

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
                <LazyImage
                  src={data ? entityPreviewURL(data.task) : undefined}
                  width={248}
                  height={140}
                  alt="task image"
                  disableFade
                />
              </Grid>

              <Grid item xs={12}>
                <SceneList taskId={data.task.id} />
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default TaskModal;
