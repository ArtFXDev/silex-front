import { FileOrFolder } from "~/types/socket";

export type RecentScene = {
  lastAccess: number;
  file: FileOrFolder;
  taskId?: string;
};

export type RecentScenes = { [id: string]: RecentScene };
