export type FileExtensionTag =
  | "sceneFile"
  | "image"
  | "video"
  | "submit"
  | "geometry";

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

  // V-Ray
  { name: "vrscene", software: "vray", tags: ["submit"] },
  { name: "vrmesh", software: "vray" },

  // Arnold
  { name: "ass", software: "arnold", tags: ["submit"] },

  // Image formats
  { name: "jpg", tags: ["image"] },
  { name: "jpeg", tags: ["image"] },
  { name: "png", tags: ["image"] },
  { name: "gif", tags: ["image"] },
  { name: "bmp", tags: ["image"] },
  { name: "bmp", tags: ["image"] },
  { name: "webp", tags: ["image"] },
  { name: "tiff", tags: ["image"] },
  { name: "tif", tags: ["image"] },

  // Geometry
  { name: "fbx", tags: ["geometry"] },
  { name: "abc", tags: ["geometry"] },
  { name: "obj", tags: ["geometry"] },
  { name: "vdb", software: "openvdb" },
];
