import { ProjectId } from "types";
import { BaseEntity } from "./BaseEntity";
import { Shot } from "./Shot";

export type SequenceId = string;

export interface Sequence extends BaseEntity {
  canceled: boolean;
  data: unknown;
  entity_type_id: string;
  id: SequenceId;
  nb_frames: number | null;
  project_id: ProjectId;
  type: "Sequence";

  shots: Shot[];
}
