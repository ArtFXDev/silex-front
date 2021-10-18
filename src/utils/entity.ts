import { Asset, Shot, Task } from "types/entities";

import { pictureThumbnailURL } from "./zou";

export const entityPreviewURL = (
  entity: Shot | Task | Asset
): string | undefined => {
  let url;

  switch (entity.type) {
    case "Asset":
    case "Shot":
      if (entity.preview_file_id) url = entity.preview_file_id;
      break;
    case "Task":
      if (entity.previews.length >= 1) url = entity.previews[0].id;
      break;
  }

  return url ? pictureThumbnailURL("preview-files", url) : undefined;
};
