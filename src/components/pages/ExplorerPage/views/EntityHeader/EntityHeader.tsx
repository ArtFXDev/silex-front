import AddIcon from "@mui/icons-material/Add";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import {
  Chip,
  Collapse,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

import CreateEntityModal from "~/components/common/CreateEntityModal/CreateEntityModal";
import { COLORS } from "~/style/colors";
import { LIST_ITEM_BORDER_RADIUS } from "~/style/constants";
import { Asset, Shot } from "~/types/entities";

import ShotHeader from "./ShotHeader";

interface EntityHeaderProps {
  entity: Shot | Asset;
}

function getEntityHeader(entity: Shot | Asset): JSX.Element | null {
  switch (entity.type) {
    case "Asset":
      return null;
    case "Shot":
      return <ShotHeader shot={entity} />;
  }
}

const EntityHeader = ({ entity }: EntityHeaderProps): JSX.Element => {
  const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);
  const [openEntitySettings, setOpenEntitySettings] = useState<boolean>(
    window.localStorage.getItem("open-entity-settings") === "true"
  );

  const navigate = useNavigate();
  const entityHeader = getEntityHeader(entity);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Typography
            variant="h6"
            color="text.disabled"
            display="inline-block"
            sx={{
              verticalAlign: "text-top",
              mr: 1,
              transition: "all 0.2s ease",
              cursor: "pointer",
              ":hover": { color: "rgba(255, 255, 255, 0.8)" },
            }}
            onClick={() => navigate(-1)}
          >
            {entity.type === "Shot"
              ? entity.sequence.name
              : entity.entity_type.name}
          </Typography>

          <Typography
            variant="h6"
            display="inline-block"
            color="text.disabled"
            mr={1}
            style={{ verticalAlign: "text-top" }}
          >
            /
          </Typography>
        </div>

        <h2
          style={{
            display: "inline-block",
            marginBottom: 0,
            marginTop: 0,
          }}
        >
          {entity.name}
        </h2>

        {entity.type === "Shot" &&
          entity.data &&
          JSON.parse(entity.data).canceled && (
            <Chip
              label="Canceled"
              color="error"
              variant="outlined"
              size="small"
              sx={{ ml: 1.5 }}
            />
          )}

        {/* Create a new task button */}
        <Tooltip title="New task" placement="top" arrow>
          <IconButton sx={{ ml: 1.5 }} onClick={() => setCreateTaskModal(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={`${entity.type} settings`} placement="top" arrow>
          <IconButton
            sx={{ ml: 0.5 }}
            onClick={() => {
              window.localStorage.setItem(
                "open-entity-settings",
                (!openEntitySettings).toString()
              );
              setOpenEntitySettings((current) => !current);
            }}
          >
            <VideoSettingsIcon
              color="disabled"
              sx={{ color: openEntitySettings ? COLORS.silexGreen : "" }}
            />
          </IconButton>
        </Tooltip>
      </div>

      {entityHeader && (
        <Collapse in={openEntitySettings} unmountOnExit>
          <Paper
            sx={{
              py: 2,
              px: 3,
              borderRadius: LIST_ITEM_BORDER_RADIUS,
              my: 2,
            }}
          >
            {entityHeader}
          </Paper>
        </Collapse>
      )}

      {createTaskModal && (
        <CreateEntityModal
          targetEntity={entity}
          onClose={() => setCreateTaskModal(false)}
          entityType="Task"
        />
      )}
    </>
  );
};

export default EntityHeader;
