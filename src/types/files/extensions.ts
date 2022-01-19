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
  tags?: FileExtensionTag[];
  software?: string;
};

export const extensions: { [name: string]: FileExtension } = {
  // Maya
  ma: { software: "maya", tags: ["sceneFile"] },
  mb: { software: "maya", tags: ["sceneFile"] },

  blend: { software: "blender", tags: ["sceneFile"] },
  nk: { software: "nuke", tags: ["sceneFile"] },

  // Houdini
  hip: { software: "houdini", tags: ["sceneFile"] },
  hipnc: { software: "houdini", tags: ["sceneFile"] },
  hda: { software: "houdini" },
  hdanc: { software: "houdini" },

  // V-Ray
  vrscene: { software: "vray", tags: ["submit"] },
  vrmesh: { software: "vray" },

  // Arnold
  ass: { software: "arnold", tags: ["submit"] },

  // Image formats
  jpg: { tags: ["image", "preview"] },
  jpeg: { tags: ["image", "preview"] },
  png: { tags: ["image", "preview"] },
  gif: { tags: ["image", "preview"] },
  bmp: { tags: ["image", "preview"] },
  webp: { tags: ["image", "preview"] },
  tiff: { tags: ["image", "openable"] },
  tif: { tags: ["image", "openable"] },
  tx: { tags: ["image"] },
  hdr: { tags: ["image", "openable"] },
  tga: { tags: ["image", "openable"] },
  exr: { tags: ["image", "openable"] },
  svg: { tags: ["image", "preview"] },

  // Video formats
  mov: { tags: ["video"] },
  mkv: { tags: ["video"] },
  avi: { tags: ["video"] },
  mp4: { tags: ["video"] },
  webm: { tags: ["video"] },

  // Geometry
  fbx: { tags: ["geometry"] },
  abc: { software: "alembic", tags: ["geometry"] },
  obj: { tags: ["geometry"] },
  vdb: { software: "openvdb" },

  // USD
  usd: { software: "usd" },
  usda: { software: "usd" },
  usdc: { software: "usd" },

  //Misc
  ies: { tags: ["light"] },
  gltf: { software: "gltf", tags: ["openable"] },
};
