export type FileExtensionTag =
  | "sceneFile"
  | "image"
  | "video"
  | "submit"
  | "geometry"
  | "preview"
  | "openable"
  | "light";

export type FileExtension = {
  name: string;
  tags?: FileExtensionTag[];
  software?: string;
};

export const extensions: FileExtension[] = [
  // Maya
  { name: "ma", software: "maya", tags: ["sceneFile"] },
  { name: "mb", software: "maya", tags: ["sceneFile"] },

  { name: "blend", software: "blender", tags: ["sceneFile"] },
  { name: "nk", software: "nuke", tags: ["sceneFile"] },

  // Houdini
  { name: "hip", software: "houdini", tags: ["sceneFile"] },
  { name: "hipnc", software: "houdini", tags: ["sceneFile"] },
  { name: "hda", software: "houdini" },
  { name: "hdanc", software: "houdini" },

  // V-Ray
  { name: "vrscene", software: "vray", tags: ["submit"] },
  { name: "vrmesh", software: "vray" },

  // Arnold
  { name: "ass", software: "arnold", tags: ["submit"] },

  // Image formats
  { name: "jpg", tags: ["image", "preview"] },
  { name: "jpeg", tags: ["image", "preview"] },
  { name: "png", tags: ["image", "preview"] },
  { name: "gif", tags: ["image", "preview"] },
  { name: "bmp", tags: ["image", "preview"] },
  { name: "webp", tags: ["image", "preview"] },
  { name: "tiff", tags: ["image", "openable"] },
  { name: "tif", tags: ["image", "openable"] },
  { name: "tx", tags: ["image"] },
  { name: "hdr", tags: ["image"] },
  { name: "tga", tags: ["image"] },

  // Video formats
  { name: "mov", tags: ["video"] },
  { name: "mkv", tags: ["video"] },
  { name: "avi", tags: ["video"] },
  { name: "mp4", tags: ["video"] },
  { name: "webm", tags: ["video"] },

  // Geometry
  { name: "fbx", tags: ["geometry"] },
  { name: "abc", tags: ["geometry"] },
  { name: "obj", tags: ["geometry"] },
  { name: "vdb", software: "openvdb" },
  { name: "fbx", tags: ["geometry"] },

  // USD
  { name: "usd", software: "usd" },
  { name: "usda", software: "usd" },
  { name: "usdc", software: "usd" },

  //Misc
  { name: "ies", tags: ["light"] },
];
