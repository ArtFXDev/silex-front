/* eslint-disable camelcase */
import { ProjectId, Sequence, SequenceId, Task } from "types/entities";

import { BaseEntity } from "./BaseEntity";

export type ShotId = string;

export type ValidationRecord = {
  id: string;
  created_at: string;
  shot_id: string;
  frame_set: string;
  total: number;
};

export interface Shot extends BaseEntity {
  id: ShotId;
  name: string;
  description: string | null;
  canceled: boolean;
  nb_frames: number | null;
  fps: number | null;
  frame_in: number | null;
  frame_out: number | null;
  project_id: ProjectId;
  entity_type_id: string;
  parent_id: SequenceId;
  source_id: string | null;
  preview_file_id: string | null;
  data: string;
  type: "Shot";
  project_name: string;

  tasks: Task[];
  sequence: Sequence;

  validation: ValidationRecord | null;
  validation_history: ValidationRecord[];
  render_time: number;
}
