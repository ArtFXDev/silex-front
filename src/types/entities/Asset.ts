/* eslint-disable camelcase */
import { BaseEntity, EntityType } from "./BaseEntity";
import { ProjectId } from "./Project";
import { Task } from "./Task";

export interface Asset extends BaseEntity {
  description: string;
  canceled: boolean;
  project_id: ProjectId;
  entity_type_id: string;
  parent_id: null;
  source_id: null;
  preview_file_id: string;
  data: unknown;
  type: "Asset";

  entity_type: EntityType;
  tasks: Task[];
}
