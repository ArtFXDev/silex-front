import { extensions, FileExtensionTag } from "types/files/extensions";

export const extensionHasTag = (
  name: string,
  tag: FileExtensionTag
): boolean => {
  const ext = extensions[name];
  if (!ext || !ext.tags) return false;
  return ext.tags.includes(tag);
};

export const getFileExtension = (name: string): string | undefined => {
  const tokens = name.split(".");
  if (tokens.length <= 1) return undefined;

  for (const token of tokens.slice(1).map((s) => s.toLowerCase())) {
    if (token in extensions) return token;
  }

  return undefined;
};

export const getFolderPath = (path: string): string => {
  const tokens = path.replaceAll("\\", "/").split("/");
  if (tokens.length <= 2) return tokens[0];
  return tokens.slice(0, -1).join("/");
};
