import { useApolloClient } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import {
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Sequence, Shot } from "types/entities";
import * as Zou from "utils/zou";

import EntitiesView from "../EntitiesView";

interface SequenceShotsProps {
  seq: Sequence;
  setCreateEntityModal: (entity: {
    type: "Shot" | "Sequence";
    target?: Sequence;
  }) => void;
  shots: Shot[];
  listView: boolean;
  isLast: boolean;
}

const SequenceShots = ({
  seq,
  setCreateEntityModal,
  shots,
  listView,
  isLast,
}: SequenceShotsProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mouseOverSequence, setMouseOverSequence] = useState<boolean>();

  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onMouseEnter={() => setMouseOverSequence(true)}
        onMouseLeave={() => setMouseOverSequence(false)}
      >
        {/* Sequence name */}
        <h2
          style={{
            display: "inline-block",
            marginBottom: 0,
            marginTop: 0,
          }}
        >
          {seq.name} {seq.nb_frames && <h4>({seq.nb_frames} frames)</h4>}
        </h2>

        {/* Add new shot + button */}
        <Tooltip title="New shot" placement="top" arrow>
          <IconButton
            sx={{ ml: 1.5 }}
            onClick={() => {
              setCreateEntityModal({
                type: "Shot",
                target: seq,
              });
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Fade in={mouseOverSequence} timeout={100}>
          <IconButton
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <InfoIcon
              color="disabled"
              fontSize={listView ? "small" : "medium"}
            />
          </IconButton>
        </Fade>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              Zou.deleteEntity("Sequence", seq.id, true)
                .then(() => {
                  client.refetchQueries({
                    include: "active",
                  });

                  enqueueSnackbar(`Deleted sequence ${seq.name}`, {
                    variant: "success",
                  });
                })
                .catch((err) => {
                  enqueueSnackbar(
                    `Error when deleting sequence ${seq.name}: ${err}`,
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
      </div>

      {seq.shots.length > 0 ? (
        <EntitiesView entities={shots} listView={listView} />
      ) : (
        <Typography color="text.disabled" mt={2}>
          No shots...
        </Typography>
      )}

      {!isLast && <br />}
    </>
  );
};

export default SequenceShots;
