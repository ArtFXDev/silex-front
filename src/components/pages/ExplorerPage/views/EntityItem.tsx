import InfoIcon from "@mui/icons-material/Info";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Fade,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { PersonsAvatarGroup } from "components/common/avatar";
import TaskStatusBadge from "components/common/TaskStatusBadge/TaskStatusBadge";
import LazyMedia from "components/utils/LazyMedia/LazyMedia";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Asset, Shot, Task } from "types/entities";
import { entityURLAndExtension, getEntityName } from "utils/entity";

const ProgressBar = ({ shot }: { shot: Shot }): JSX.Element => {
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

interface EntityItemProps {
  index: number;
  entity: Shot | Task | Asset;
  selected?: boolean;
  listView: boolean;
}

const EntityItem = ({
  index,
  entity,
  selected,
  listView,
}: EntityItemProps): JSX.Element => {
  const [mouseOver, setMouseOver] = useState<boolean>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const history = useHistory();
  const routeMatch = useRouteMatch();

  const name = getEntityName(entity);

  const handleMoreActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreActions = () => {
    setAnchorEl(null);
    setMouseOver(false);
  };

  const onClickAction = () => {
    history.push(
      `${routeMatch.url}/${entity.id}${entity.type === "Task" ? "" : "/tasks"}`
    );
  };

  return (
    <Fade in timeout={{ appear: 2000 * index, enter: 800 }}>
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
        <Card
          raised
          elevation={2}
          sx={{
            position: "relative",
            transition: "box-shadow 0.1s ease",
            ":hover": {
              boxShadow: "0 0 0 2px rgba(200, 200, 200, 0.4)",
            },
            my: 1,
            cursor: "pointer",
          }}
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
        >
          <Button color="secondary" sx={{ p: 0 }}>
            <CardMedia
              sx={{ position: "relative", width: 180, height: 100 }}
              onClick={onClickAction}
            >
              <LazyMedia
                src={entityURLAndExtension(entity)}
                width={180}
                height={100}
                alt="test"
                disableBorder
              />
            </CardMedia>
          </Button>

          <CardActions sx={{ py: 0, height: 40 }}>
            <Typography component="div" sx={{ marginRight: "auto" }}>
              {name}
            </Typography>

            <Fade in={mouseOver} timeout={100}>
              <IconButton
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={handleMoreActionsClick}
              >
                <InfoIcon color="disabled" />
              </IconButton>
            </Fade>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMoreActions}
            >
              <MenuItem>Delete</MenuItem>
            </Menu>

            {entity.type === "Shot" && <ProgressBar shot={entity} />}

            {entity.type === "Task" && (
              <TaskStatusBadge taskStatus={entity.taskStatus} />
            )}
          </CardActions>
        </Card>
      )}
    </Fade>
  );
};

export default EntityItem;
