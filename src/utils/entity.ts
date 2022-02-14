import { Asset, Shot, Task } from "types/entities";
import { PreviewFile } from "types/entities/PreviewFile";

import { originalPreviewFileURL, pictureThumbnailURL } from "./zou";

export const entityURLAndExtension = (
  entity: Shot | Task | Asset,
  type: "original" | "thumbnail",
  revision?: number
): { url: string; extension: string } | undefined => {
  let id;
  let extension = "png";

  switch (entity.type) {
    case "Asset":
    case "Shot":
      if (entity.preview_file_id) id = entity.preview_file_id;
      break;
    case "Task":
      if (entity.previews.length > 0) {
        let preview;

        if (revision) {
          preview = entity.previews.find(
            (p) => p.revision === revision
          ) as PreviewFile;
        } else {
          preview = entity.previews[0];
        }

        id = preview.id;
        extension = preview.extension;
      }

      break;
  }

  if (!id) return undefined;

  return {
    url:
      type === "original" || extension === "mp4"
        ? originalPreviewFileURL(
            id,
            extension === "mp4" ? "movies" : "pictures",
            extension
          )
        : pictureThumbnailURL("preview-files", id, extension),
    extension,
  };
};

export const getEntityName = (entity: Shot | Task | Asset): string => {
  return entity.type === "Task" ? `${entity.taskType.name}` : entity.name;
};

export const getEntityFullName = (entity: Shot | Task | Asset): string => {
  return entity.type === "Shot"
    ? `${entity.sequence.name} - ${entity.name}`
    : entity.name;
};
