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
import { Asset, Sequence, Shot, Task } from "types/entities";

import CreateAssetView from "./views/CreateAssetView";
import CreateSequenceView from "./views/CreateSequenceView";
import CreateShotView from "./views/CreateShotView";
import CreateTaskView from "./views/CreateTaskView";

type PossibleEntity = Sequence | Shot | Task | Asset;
type TargetEntity = Asset | Sequence | Shot;

interface CreateEntityModalProps {
  /** Entity on which we want to create things (eg create Tasks on an asset) */
  targetEntity?: TargetEntity;

  /** The type of entity we want to create */
  entityType: PossibleEntity["type"];

  /** A possible default category (useful for assets) */
  defaultCategory?: string;

  /** Called when closing the modal */
  onClose: () => void;

  /** Optional project id */
  projectId?: string;
}

const getEntityCreationView = (
  entityType: PossibleEntity["type"],
  targetEntity: TargetEntity | undefined,
  defaultCategory: string | undefined,
  onClose: () => void,
  projectId: string | undefined
) => {
  switch (entityType) {
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
          targetSequence={targetEntity as Sequence}
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

const CreateEntityModal = ({
  targetEntity,
  entityType,
  defaultCategory,
  onClose,
  projectId,
}: CreateEntityModalProps): JSX.Element => {
  const [choosenEntityType, setChoosenEntityType] =
    useState<PossibleEntity["type"]>(entityType);

  const possibleCreationWindows = ["Asset", "Sequence", "Shot"];

  // We can only create a task when in an asset/shot or sequence context
  if (targetEntity) possibleCreationWindows.push("Task");

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
              variant="outlined"
              onChange={(e) =>
                setChoosenEntityType(e.target.value as PossibleEntity["type"])
              }
            >
              {possibleCreationWindows.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </div>

          <IconButton onClick={onClose}>
            <CloseIcon color="disabled" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ height: "100%" }}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {getEntityCreationView(
            choosenEntityType,
            targetEntity,
            defaultCategory,
            onClose,
            projectId
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEntityModal;
