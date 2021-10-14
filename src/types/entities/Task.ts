/* eslint-disable camelcase */
import { BaseEntity, ProjectId } from "types/entities";

import { Person } from "./Person";
import { PreviewFile } from "./PreviewFile";
import { TaskStatus } from "./TaskStatus";
import { TaskType } from "./TaskType";

export type TaskId = string;

export interface Task extends BaseEntity {
  id: TaskId;
  description: string | null;
  priority: number;
  duration: number;
  estimation: number;
  completion_rate: number;
  retake_count: number;
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  due_date: string | null;
  real_start_date: string | null;
  last_comment_date: string | null;
  data: unknown;
  project_id: ProjectId;
  type: "Task";
  project_name: string;
  task_type_name: string;
  task_status_name: string;
  entity_type_name: string;
  entity_name: string;

  taskType: TaskType;
  taskStatus: TaskStatus;
  assignees: Person[];
  previews: PreviewFile[];
}
