import { Task } from "types/entities";

export type RecentTask = {
  pathname: string;
  lastAccess: number;
  task: Task;
};

export type RecentTasks = { [id: Task["id"]]: RecentTask };
