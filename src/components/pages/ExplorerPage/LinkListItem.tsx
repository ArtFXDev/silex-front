import {
  ListItem,
  Paper,
  ListItemButton,
  ListItemText,
  IconButton,
  Fade,
  Card,
  CardMedia,
  Typography,
  CardActions,
  Box,
  ButtonBase,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import { useLocation, useHistory } from "react-router-dom";

import { Sequence, Shot, Task } from "types";
import { originalPreviewFileURL } from "utils/kitsu";

interface LinkListItemProps {
  index: number;
  entity: Sequence | Shot | Task;
  selected: boolean;
  onClick: () => void;
  listView: boolean;
}

const LinkListItem: React.FC<LinkListItemProps> = ({
  index,
  entity,
  selected,
  onClick,
  listView,
}) => {
  const location = useLocation();
  const history = useHistory();

  const pushToNextView = () => {
    history.push(
      location.pathname.slice(-1) === "/"
        ? `${location.pathname}${entity.id}`
        : `${location.pathname}/${entity.id}`
    );
  };

  return (
    <Fade in={true} timeout={index * 100}>
      {listView ? (
        <Paper elevation={1} sx={{ m: 1, borderRadius: 2 }}>
          <ListItem
            disablePadding
            secondaryAction={
              entity.type !== "Task" ? (
                <IconButton onClick={pushToNextView}>
                  <ArrowForwardIcon />
                </IconButton>
              ) : null
            }
          >
            <ListItemButton
              selected={selected}
              onClick={onClick}
              sx={{ borderRadius: 2 }}
              disableRipple
            >
              <ListItemText
                primary={
                  entity.type === "Task" ? entity.task_type_name : entity.name
                }
              />
            </ListItemButton>
          </ListItem>
        </Paper>
      ) : (
        <ButtonBase onClick={onClick}>
          <Card sx={{ m: 2 }}>
            {entity.type === "Shot" && entity.preview_file_id ? (
              <CardMedia
                component="img"
                sx={{ width: "180px", height: "100px" }}
                image={
                  entity.type === "Shot" && entity.preview_file_id
                    ? originalPreviewFileURL(entity.preview_file_id)
                    : undefined
                }
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "180px",
                  height: "100px",
                }}
              >
                <HideImageOutlinedIcon />
              </Box>
            )}

            <CardActions>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ marginRight: "auto" }}
              >
                {entity.type === "Task" ? entity.task_type_name : entity.name}
              </Typography>
              {/* <IconButton onClick={pushToNextView}>
                <ArrowForwardIcon />
              </IconButton> */}
            </CardActions>
          </Card>
        </ButtonBase>
      )}
    </Fade>
  );
};

export default LinkListItem;
