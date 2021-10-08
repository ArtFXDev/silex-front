/* eslint-disable camelcase */
import { ProjectId, SequenceId, Task } from "types";
import { BaseEntity } from "./BaseEntity";

export type ShotId = string;

export interface Shot extends BaseEntity {
  id: ShotId;
  name: "SH01";
  description: string | null;
  canceled: boolean;
  nb_frames: number | null;
  project_id: ProjectId;
  entity_type_id: string;
  parent_id: SequenceId;
  source_id: string | null;
  preview_file_id: string | null;
  data: unknown;
  type: "Shot";
  project_name: string;
  sequence_name: string;

  tasks: Task[];
}
