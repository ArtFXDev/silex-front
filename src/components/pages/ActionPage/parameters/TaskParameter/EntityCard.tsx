import { Card, CardActions, CardMedia, Typography } from "@mui/material";
import LazyImage from "components/utils/LazyImage/LazyImage";
import { Asset, Shot, Task } from "types/entities";
import { entityPreviewURL } from "utils/entity";

interface EntityCardProps {
  /** The entity to display */
  entity: Shot | Asset | Task;

  /** Optional name override */
  name?: string;

  /** Wether or not the card is highlighted */
  selected?: boolean;
}

/**
 * Simple entity card to display in the task parameter
 */
const EntityCard = ({
  entity,
  name,
  selected,
}: EntityCardProps): JSX.Element => {
  return (
    <Card
      raised
      elevation={2}
      sx={{
        position: "relative",
        transition: "box-shadow 0.1s ease",
        ":hover": {
          boxShadow: !selected ? "0 0 0 2px rgba(200, 200, 200, 0.4)" : "",
        },
        boxShadow: selected ? "0 0 0 2px #62c673" : "",
        cursor: "pointer",
      }}
    >
      <CardMedia sx={{ width: 90, height: 50 }}>
        <LazyImage
          src={entityPreviewURL(entity)}
          width={90}
          height={50}
          alt={entity.name}
          disableBorder
        />
      </CardMedia>

      <CardActions sx={{ py: 0, height: 20 }}>
        <Typography component="div" variant="caption">
          {name || entity.name}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default EntityCard;
