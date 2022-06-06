import { gql, useApolloClient, useQuery } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, emphasize } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { PersonsAvatarGroup } from "components/common/avatar";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import ArrowDelimiter from "components/common/Separator/ArrowDelimiter";
import { useAuth } from "context";
import { forwardRef, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Task } from "types/entities";
import { RecentTask } from "types/storage/task";
import { formatDateTime } from "utils/date";
import { addElementToLocalStorageQueue } from "utils/storage";
import { assignUserToTask, clearAssignation } from "utils/zou";

import FileExplorer from "./FileExplorer";
import ThumbnailsViewer from "./ThumbnailsViewer";

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
        revision
      }

      entity {
        ... on Shot {
          id
          name
          type
          preview_file_id

          sequence {
            id
            name
          }
        }

        ... on Asset {
          id
          name
          type
          preview_file_id
        }
      }
    }
  }
`;

const CustomArrowDelimiter = () => <ArrowDelimiter mx={1.2} fontSize={20} />;

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
  const routeMatch = useRouteMatch<{ taskId: string }>();

  const history = useHistory();
  const { user } = useAuth();
  const client = useApolloClient();

  const onClose = () => {
    history.push(window.location.pathname.split("/").slice(0, -1).join("/"));
  };

  const query = useQuery<{ task: Task }>(TASK, {
    variables: { id: routeMatch.params.taskId },
    fetchPolicy: "cache-and-network",
  });
  const { data } = query;

  const currentUserAssignedToTask =
    data && data.task.assignees.some((p) => p.id === user?.id);

  // Store the current task in the local storage to have an history of recent tasks
  useEffect(() => {
    if (data) {
      addElementToLocalStorageQueue<RecentTask>(
        "recent-tasks",
        data.task.id,
        {
          pathname: window.location.pathname,
          lastAccess: Date.now(),
          task: data.task,
        },
        5
      );
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <ColoredCircle
                  size={22}
                  color={data.task.taskType.color}
                  marginLeft={15}
                  marginRight={15}
                />

                {data.task.entity.type === "Shot" && (
                  <>
                    <Typography fontSize={18} color="text.disabled">
                      {data.task.entity.sequence.name}
                    </Typography>
                    <CustomArrowDelimiter />
                  </>
                )}

                <Typography fontSize={18} color="text.disabled">
                  {data.task.entity.name}
                </Typography>

                <CustomArrowDelimiter />

                <Typography
                  fontSize={18}
                  sx={{
                    color: emphasize(data.task.taskType.color, 0.2),
                    border: `1px solid ${alpha(data.task.taskType.color, 0.5)}`,
                    backgroundColor: alpha(data.task.taskType.color, 0.1),
                    borderRadius: "999px",
                    px: 2,
                  }}
                >
                  {data.task.taskType.name}
                </Typography>

                <CustomArrowDelimiter />

                <Typography
                  fontSize={18}
                  component="span"
                  color="text.disabled"
                >
                  {data.task.name}
                </Typography>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
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
              </div>
            </div>
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
                <div style={{ float: "right" }}>
                  <ThumbnailsViewer task={data.task} />
                </div>
              </Grid>

              <Grid item xs={12}>
                <FileExplorer task={data.task} />
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default TaskModal;
