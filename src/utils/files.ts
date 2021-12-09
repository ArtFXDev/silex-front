/**
 * Returns the dcc name associated with the given file extension
 */
export const extensionToDCCName = (ext: string): string | null => {
  switch (ext) {
    case "ma":
    case "mb":
      return "maya";
    case "blend":
      return "blender";
    case "nk":
      return "nuke";
    case "hip":
    case "hipnc":
      return "houdini";
    default:
      return null;
  }
};
