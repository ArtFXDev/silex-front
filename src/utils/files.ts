import { extensions, FileExtensionTag } from "types/files/extensions";

/**
 * Returns true if an extension has a specific tag
 */
export const extensionHasTag = (
  name: string,
  tag: FileExtensionTag
): boolean => {
  const ext = extensions[name];
  if (!ext || !ext.tags) return false;
  return ext.tags.includes(tag);
};

/**
 * Return an extension given a filename
 * If multiple extension tokens are found (eg: file.bgeo.sc) it returns the first one
 * The extension must exist in the extensions dictionnary otherwise it's undefined
 */
export const getFileExtension = (name: string): string | undefined => {
  const tokens = name.split(".");
  if (tokens.length <= 1) return undefined;

  for (const token of tokens.slice(1).map((s) => s.toLowerCase())) {
    if (token in extensions) return token;
  }

  return undefined;
};

/**
 * Returns a file extension software / full extension
 * Ex: test.png -> png
 *     scene.ma -> maya
 *     mesh.bgeo.sc -> houdini
 */
export const getExtensionSoftwareFromFileName = (
  name: string
): string | undefined => {
  const extension = getFileExtension(name);

  if (extension) {
    const software = extensions[extension].software;
    return software || extension;
  }

  return undefined;
};
