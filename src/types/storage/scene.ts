import { FileOrFolder } from "types/socket";

export type RecentScene = {
  lastAccess: number;
  file: FileOrFolder;
};

export type RecentScenes = { [id: string]: RecentScene };
