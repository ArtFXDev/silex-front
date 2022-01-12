export type FileExtensionTag =
  | "sceneFile"
  | "image"
  | "video"
  | "submit"
  | "geometry"
  | "preview";

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
  { name: "jpg", tags: ["image", "preview"] },
  { name: "jpeg", tags: ["image", "preview"] },
  { name: "png", tags: ["image", "preview"] },
  { name: "gif", tags: ["image", "preview"] },
  { name: "bmp", tags: ["image", "preview"] },
  { name: "webp", tags: ["image", "preview"] },
  { name: "tiff", tags: ["image"] },
  { name: "tif", tags: ["image"] },

  // Geometry
  { name: "fbx", tags: ["geometry"] },
  { name: "abc", tags: ["geometry"] },
  { name: "obj", tags: ["geometry"] },
  { name: "vdb", software: "openvdb" },
];
