import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Chip, Dialog, IconButton, Typography } from "@mui/material";
import LazyMedia from "components/utils/LazyMedia/LazyMedia";
import { useState } from "react";
import { Task } from "types/entities";
import { PreviewFile } from "types/entities/PreviewFile";
import { entityURLAndExtension } from "utils/entity";

interface ThumbnailsViewerProps {
  task: Task;
}

const ThumbnailsViewer = ({ task }: ThumbnailsViewerProps): JSX.Element => {
  const [zoomPreview, setZoomPreview] = useState<boolean>(false);
  const [currentPreviewRevision, setCurrentPreviewRevision] = useState<
    PreviewFile["revision"] | undefined
  >(task.previews.length > 0 ? task.previews[0].revision : undefined);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          gap: 5,
        }}
      >
        {task.previews.slice(0, 5).map((preview) => {
          const isCurrentPreview = currentPreviewRevision === preview.revision;

          return (
            <Chip
              key={preview.id}
              label={`v${preview.revision}`}
              variant="outlined"
              size="small"
              color={isCurrentPreview ? "success" : "default"}
              onClick={() => setCurrentPreviewRevision(preview.revision)}
              sx={{ color: isCurrentPreview ? "success" : "text.disabled" }}
            />
          );
        })}

        {task.previews.length > 5 && (
          <Typography color="text.disabled">...</Typography>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <LazyMedia
          src={entityURLAndExtension(task, "thumbnail", currentPreviewRevision)}
          width={248}
          height={140}
          alt="task image"
          disableFade
        />

        {task.previews.length >= 1 && (
          <IconButton
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => setZoomPreview(true)}
          >
            <ZoomInIcon />
          </IconButton>
        )}
      </div>

      {zoomPreview && (
        <Dialog open onClose={() => setZoomPreview(false)}>
          <img
            src={
              entityURLAndExtension(task, "original", currentPreviewRevision)
                ?.url
            }
          />
        </Dialog>
      )}
    </div>
  );
};

export default ThumbnailsViewer;
