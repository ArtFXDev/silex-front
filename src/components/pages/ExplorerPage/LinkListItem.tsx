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
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLocation, useHistory } from "react-router-dom";

import { Sequence, Shot, Task } from "types";
import { pictureThumbnailURL } from "utils/kitsu";
import LazyImage from "components/LazyImage/LazyImage";

interface LinkListItemProps {
  index: number;
  entity: Sequence | Shot | Task;
  selected: boolean;
  selectCurrent: () => void;
  listView: boolean;
}

const LinkListItem: React.FC<LinkListItemProps> = ({
  index,
  entity,
  selected,
  selectCurrent,
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
    <Fade in={true} timeout={index * 200}>
      {listView ? (
        <Paper elevation={1} sx={{ m: 1, borderRadius: 2 }}>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton onClick={selectCurrent}>
                <InfoOutlinedIcon />
              </IconButton>
            }
          >
            <ListItemButton
              selected={selected}
              onClick={entity.type !== "Task" ? pushToNextView : selectCurrent}
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
        <Card sx={{ m: 2 }} raised elevation={2}>
          <CardMedia sx={{ width: 180, height: 100 }}>
            <LazyImage
              src={
                entity.type === "Shot" && entity.preview_file_id
                  ? pictureThumbnailURL("preview-files", entity.preview_file_id)
                  : undefined
              }
              width={180}
              height={100}
              alt="test"
              disableBorder
            />
          </CardMedia>

          <CardActions sx={{ py: 0 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ marginRight: "auto" }}
            >
              {entity.type === "Task" ? entity.task_type_name : entity.name}
            </Typography>

            <IconButton onClick={selectCurrent}>
              <InfoOutlinedIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
    </Fade>
  );
};

export default LinkListItem;
