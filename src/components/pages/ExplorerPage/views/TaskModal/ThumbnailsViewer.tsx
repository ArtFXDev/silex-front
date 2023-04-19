import { useApolloClient } from "@apollo/client";
import PushPinIcon from "@mui/icons-material/PushPin";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Chip, Dialog, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

import LazyMedia from "~/components/utils/LazyMedia/LazyMedia";
import { Task } from "~/types/entities";
import { PreviewFile } from "~/types/entities/PreviewFile";
import { entityURLAndExtension } from "~/utils/entity";
import * as Zou from "~/utils/zou";

interface ThumbnailsViewerProps {
  task: Task;
}

const ThumbnailsViewer = ({ task }: ThumbnailsViewerProps): JSX.Element => {
  const [zoomPreview, setZoomPreview] = useState<boolean>(false);
  const [currentPreviewRevision, setCurrentPreviewRevision] = useState<
    PreviewFile["revision"] | undefined
  >(task.previews.length > 0 ? task.previews[0].revision : undefined);

  const client = useApolloClient();

  const currentPreview = task.previews.find(
    (p) => p.revision === currentPreviewRevision
  );

  const currentPreviewIsTaskPreview =
    currentPreview && currentPreview.id === task.entity.preview_file_id;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginRight: 15,
          gap: 5,
        }}
      >
        {task.previews.slice(0, 4).map((preview) => {
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

        {task.previews.length > 4 && (
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

        {currentPreview && (
          <Tooltip title={"Pin as main preview"} placement="top" arrow>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `rotate(-45deg)`,
              }}
              onClick={() => {
                if (!currentPreviewIsTaskPreview) {
                  Zou.setAsMainPreview(currentPreview.id).then(() =>
                    client.refetchQueries({ include: "active" })
                  );
                }
              }}
            >
              <PushPinIcon
                sx={{
                  color: currentPreviewIsTaskPreview
                    ? "#66BB6A"
                    : "rgba(255, 255, 255, 0.3)",
                }}
              />
            </IconButton>
          </Tooltip>
        )}

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
