/* eslint-disable camelcase */
import { ProjectId, Sequence, SequenceId, Task } from "types/entities";

import { BaseEntity } from "./BaseEntity";

export type ShotId = string;

export interface Shot extends BaseEntity {
  id: ShotId;
  name: string;
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

  tasks: Task[];
  sequence: Sequence;
}
