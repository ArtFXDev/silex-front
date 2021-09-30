import { Task } from "./Task";
import { BaseEntity } from "./BaseEntity";
import { ProjectId } from "./Project";

export interface Asset extends BaseEntity {
  description: string;
  canceled: boolean;
  nb_frames: number | null;
  project_id: ProjectId;
  entity_type_id: string;
  parent_id: null;
  source_id: null;
  preview_file_id: string;
  data: unknown;
  type: "Asset";

  tasks: Task[];
}
