import { useApolloClient } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import { PersonsAvatarGroup } from "components/common/avatar";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import LazyMedia from "components/utils/LazyMedia/LazyMedia";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Asset, Shot, Task } from "types/entities";
import { entityURLAndExtension, getEntityName } from "utils/entity";
import * as Zou from "utils/zou";

import ShotProgressBar from "./ShotProgressBar";

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mouseOver, setMouseOver] = useState<boolean>();
  const actionMenuButton = useRef<HTMLButtonElement>(null);

  const history = useHistory();
  const routeMatch = useRouteMatch();
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();

  const entityName = getEntityName(entity);

  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Stop propagation of onClick event because buttons are overlaping
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setMouseOver(false);
  };

  // Called when clicking on the item, goes to the next route
  const onClickAction = (event: React.MouseEvent<HTMLElement>) => {
    // Prevent clicking when the menu is open
    if (!anchorEl && event.target !== actionMenuButton.current) {
      history.push(
        `${routeMatch.url}/${entity.id}${
          entity.type === "Task" ? "" : "/tasks"
        }`
      );
    }
  };

  const actionMenuIcon = () => {
    const button = (
      <IconButton
        sx={!listView ? { position: "absolute", top: 0, right: 0 } : { ml: 1 }}
        onClick={handleActionMenuClick}
        ref={actionMenuButton}
      >
        <InfoIcon color="disabled" fontSize={listView ? "small" : "medium"} />
      </IconButton>
    );

    return listView ? (
      button
    ) : (
      <Fade in={mouseOver || Boolean(anchorEl)} timeout={100}>
        {button}
      </Fade>
    );
  };

  return (
    <>
      <Fade in timeout={{ appear: 2000 * index, enter: 800 }}>
        {listView ? ( // LIST ITEM
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    marginRight: "auto",
                  }}
                >
                  <ListItemText primary={entityName} />

                  {entity.type === "Task" && (
                    <Typography color="text.disabled" fontSize={14} ml={1}>
                      {entity.name}
                    </Typography>
                  )}
                </div>

                {entity.type === "Task" && (
                  <PersonsAvatarGroup
                    persons={entity.assignees}
                    sx={{ mr: 1 }}
                  />
                )}

                {entity.type === "Shot" && <ShotProgressBar shot={entity} />}

                {entity.type === "Task" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "30px",
                    }}
                  >
                    <ColoredCircle size={18} color={entity.taskType.color} />
                  </div>
                )}

                {actionMenuIcon()}
              </ListItemButton>
            </ListItem>
          </Paper>
        ) : (
          // CARD ITEM
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
          >
            <Button
              color="secondary"
              sx={{ p: 0, my: 0, textTransform: "none" }}
              onClick={onClickAction}
            >
              <Card
                raised
                elevation={2}
                sx={{
                  width: 180,
                  transition: "box-shadow 0.1s ease",
                  ":hover": {
                    boxShadow: "0 0 0 2px rgba(200, 200, 200, 0.4)",
                  },
                  cursor: "pointer",
                }}
              >
                <CardMedia
                  sx={{ position: "relative", width: 180, height: 100 }}
                >
                  <LazyMedia
                    src={entityURLAndExtension(entity, "thumbnail")}
                    width={180}
                    height={100}
                    alt={entity.name}
                    disableBorder
                  />
                </CardMedia>

                <CardActions
                  sx={{
                    py: 0,
                    height: 40,
                    borderTop:
                      entity.type === "Task"
                        ? `3px solid ${entity.taskType.color}`
                        : "",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "baseline",
                      marginRight: "auto",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Typography component="div" noWrap>
                      {entityName}
                    </Typography>

                    {entity.type === "Task" && (
                      <Typography color="text.disabled" fontSize={14} ml={1}>
                        {entity.name}
                      </Typography>
                    )}
                  </div>

                  {entity.type === "Shot" && entity.tasks.length > 0 && (
                    <ShotProgressBar shot={entity} />
                  )}
                </CardActions>
              </Card>
            </Button>

            {actionMenuIcon()}
          </div>
        )}
      </Fade>

      {/* Action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem
          onClick={() => {
            Zou.deleteEntity(entity.type, entity.id, true)
              .then(() => {
                client.refetchQueries({
                  include: "active",
                });

                enqueueSnackbar(
                  `Deleted ${entity.type.toLowerCase()} ${getEntityName(
                    entity
                  )}`,
                  { variant: "success" }
                );
              })
              .catch((err) => {
                enqueueSnackbar(
                  `Error when deleting ${entity.type.toLowerCase()} ${
                    entity.name
                  }: ${err}`,
                  { variant: "error" }
                );
              });
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default EntityItem;
