import {
  extensions,
  FileExtension,
  FileExtensionTag,
} from "types/files/extensions";

/**
 * Returns the name associated with the given file extension
 * It is mostly used for logos
 */
export const getExtensionFromName = (
  name: string,
  tag?: FileExtensionTag
): FileExtension | undefined => {
  return extensions.find(
    (e) => e.name === name && (!tag || (e.tags && e.tags.includes(tag)))
  );
};

export const getFolderPath = (path: string): string => {
  const tokens = path.replaceAll("\\", "/").split("/");
  if (tokens.length <= 2) return tokens[0];
  return tokens.slice(0, -1).join("/");
};
