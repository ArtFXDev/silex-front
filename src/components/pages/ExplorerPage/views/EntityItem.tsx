import {
  ListItem,
  Paper,
  ListItemButton,
  ListItemText,
  Fade,
  Card,
  CardMedia,
  Typography,
  CardActions,
  Button,
  LinearProgress,
} from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Shot, Task, Asset } from "types";
import { pictureThumbnailURL } from "utils/zou";
import LazyImage from "components/LazyImage/LazyImage";
import TaskStatusBadge from "components/TaskStatusBadge/TaskStatusBadge";
import { PersonsAvatarGroup } from "components/avatar";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";

interface EntityItemProps {
  index: number;
  entity: Shot | Task | Asset;
  selected?: boolean;
  listView: boolean;
  openTaskModal?: (taskId: string) => void;
}

const ProgressBar: React.FC<{ shot: Shot }> = ({ shot }) => {
  const nDone = shot.tasks
    .map((task) => task.taskStatus.is_done)
    .filter((d) => d).length;
  const progressPercent = (nDone / shot.tasks.length) * 100;

  return (
    <LinearProgress
      variant="determinate"
      color="success"
      sx={{ width: 100, height: 8, borderRadius: 5 }}
      value={progressPercent}
    />
  );
};

const EntityItem: React.FC<EntityItemProps> = ({
  index,
  entity,
  selected,
  listView,
  openTaskModal,
}) => {
  const history = useHistory();
  const routeMatch = useRouteMatch();

  const name = entity.type === "Task" ? entity.taskType.name : entity.name;

  const onClickAction = () => {
    openTaskModal
      ? openTaskModal(entity.id)
      : history.push(
          `${routeMatch.url}/${entity.id}${
            entity.type === "Shot" ? "/tasks" : ""
          }`
        );
  };

  return (
    <Fade in={true} timeout={index * 200}>
      {listView ? (
        <Paper
          elevation={1}
          sx={{ my: 1, borderRadius: LIST_ITEM_BORDER_RADIUS }}
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={selected}
              onClick={onClickAction}
              sx={{ borderRadius: LIST_ITEM_BORDER_RADIUS }}
              disableRipple
            >
              <ListItemText primary={name} />

              {entity.type === "Task" && (
                <PersonsAvatarGroup persons={entity.assignees} sx={{ mr: 3 }} />
              )}

              {entity.type === "Shot" && <ProgressBar shot={entity} />}

              {entity.type === "Task" && (
                <TaskStatusBadge taskStatus={entity.taskStatus} />
              )}
            </ListItemButton>
          </ListItem>
        </Paper>
      ) : (
        <Button color="secondary" sx={{ p: 0, textTransform: "none", my: 1 }}>
          <Card
            raised
            elevation={2}
            sx={{
              transition: "box-shadow 0.1s ease",
              "&:hover": {
                boxShadow: "0 0 0 2px rgba(200, 200, 200, 0.4)",
              },
            }}
          >
            <CardMedia sx={{ width: 180, height: 100 }}>
              <LazyImage
                src={
                  (entity.type === "Shot" || entity.type === "Asset") &&
                  entity.preview_file_id
                    ? pictureThumbnailURL(
                        "preview-files",
                        entity.preview_file_id
                      )
                    : undefined
                }
                width={180}
                height={100}
                alt="test"
                onClick={onClickAction}
                disableBorder
              />
            </CardMedia>

            <CardActions sx={{ py: 0, height: 40 }}>
              <Typography component="div" sx={{ marginRight: "auto" }}>
                {name}
              </Typography>

              {entity.type === "Shot" && <ProgressBar shot={entity} />}

              {entity.type === "Task" && (
                <TaskStatusBadge taskStatus={entity.taskStatus} />
              )}
            </CardActions>
          </Card>
        </Button>
      )}
    </Fade>
  );
};

export default EntityItem;
