import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { Asset, Sequence, Shot, Task } from "~/types/entities";

import CreateAssetView from "./views/CreateAssetView";
import CreateSequenceView from "./views/CreateSequenceView";
import CreateShotView from "./views/CreateShotView";
import CreateTaskView from "./views/CreateTaskView";

type PossibleEntity = Sequence | Shot | Task | Asset;
export type TargetEntity = Pick<
  Asset | Sequence | Shot,
  "id" | "type" | "name"
>;

interface CreateEntityModalProps {
  /** Entity on which we want to create things (eg create Tasks on an asset) */
  targetEntity?: TargetEntity;

  /** The default entity view */
  entityType: PossibleEntity["type"];

  /** Array of possible entity types we want to create */
  entityTypes?: PossibleEntity["type"][];

  /** Called when closing the modal */
  onClose: () => void;

  /** An optional default category (useful for assets) */
  defaultCategory?: string;

  /** Optional project id */
  projectId?: string;
}

const CreateEntityModal = ({
  targetEntity,
  entityType,
  entityTypes,
  defaultCategory,
  onClose,
  projectId,
}: CreateEntityModalProps): JSX.Element => {
  const [choosenEntityType, setChoosenEntityType] =
    useState<PossibleEntity["type"]>(entityType);

  const getEntityCreationView = () => {
    switch (choosenEntityType) {
      case "Asset":
        return (
          <CreateAssetView
            onClose={onClose}
            defaultCategory={defaultCategory}
            projectIdOverride={projectId}
          />
        );
      case "Task":
        return (
          <CreateTaskView
            onClose={onClose}
            targetEntity={targetEntity as TargetEntity}
            projectIdOverride={projectId}
          />
        );
      case "Shot":
        return (
          <CreateShotView
            onClose={onClose}
            targetEntity={targetEntity as TargetEntity}
            projectIdOverride={projectId}
          />
        );
      case "Sequence":
        return (
          <CreateSequenceView onClose={onClose} projectIdOverride={projectId} />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" display="inline-block">
              Create a new
            </Typography>
            <Select
              sx={{
                height: 40,
                borderRadius: 3,
                pt: 0,
                ml: 2,
              }}
              color="success"
              value={choosenEntityType}
              autoFocus
              disabled={!entityTypes}
              variant="outlined"
              onChange={(e) =>
                setChoosenEntityType(e.target.value as PossibleEntity["type"])
              }
            >
              {entityTypes ? (
                entityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={entityType}>{entityType}</MenuItem>
              )}
            </Select>
          </div>

          <IconButton onClick={onClose}>
            <CloseIcon color="disabled" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ height: "100%" }}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {getEntityCreationView()}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEntityModal;
