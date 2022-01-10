import {
  extensions,
  FileExtension,
  FileExtensionTag,
} from "types/files/extensions";

export const extensionHasTag = (
  name: string,
  tag: FileExtensionTag
): boolean => {
  const ext = extensions.find((e) => e.name === name);
  if (!ext || !ext.tags) return false;
  return ext.tags.includes(tag);
};

/**
 * Returns the name associated with the given file extension
 * It is mostly used for logos
 */
export const getExtensionFromName = (
  name: string,
  tag?: FileExtensionTag
): FileExtension | undefined => {
  return extensions.find(
    (e) =>
      e.name === name.toLowerCase() &&
      (!tag || (e.tags && e.tags.includes(tag)))
  );
};

export const getFolderPath = (path: string): string => {
  const tokens = path.replaceAll("\\", "/").split("/");
  if (tokens.length <= 2) return tokens[0];
  return tokens.slice(0, -1).join("/");
};
