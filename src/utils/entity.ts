import { Asset, Shot, Task } from "types/entities";

import { originalPreviewFileURL, pictureThumbnailURL } from "./zou";

export const entityURLAndExtension = (
  entity: Shot | Task | Asset,
  type: "original" | "thumbnail"
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
        const sortedByRevision = entity.previews
          .slice()
          .sort((a, b) => a.revision - b.revision);

        const lastIndex = sortedByRevision.length - 1;
        id = sortedByRevision[lastIndex].id;
        extension = sortedByRevision[lastIndex].extension;
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
