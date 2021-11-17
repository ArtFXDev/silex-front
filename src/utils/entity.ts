import { Asset, Shot, Task } from "types/entities";

import { originalPreviewFileURL, pictureThumbnailURL } from "./zou";

export const entityURLAndExtension = (
  entity: Shot | Task | Asset
): { url: string; extension: string } | undefined => {
  let url,
    extension = "png";

  switch (entity.type) {
    case "Asset":
    case "Shot":
      if (entity.preview_file_id) url = entity.preview_file_id;
      break;
    case "Task":
      if (entity.previews.length > 0) {
        const lastIndex = entity.previews.length - 1;
        url = entity.previews[lastIndex].id;
        extension = entity.previews[lastIndex].extension;
      }
      break;
  }

  if (!url) return undefined;

  return {
    url:
      extension && extension !== "png"
        ? originalPreviewFileURL(
            url,
            extension === "mp4" ? "movies" : "pictures",
            extension
          )
        : pictureThumbnailURL("preview-files", url, extension),
    extension,
  };
};

export const getEntityName = (entity: Shot | Task | Asset): string => {
  return entity.type === "Task" ? entity.taskType.name : entity.name;
};
