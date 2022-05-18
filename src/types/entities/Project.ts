/* eslint-disable camelcase */
import { Asset } from "./Asset";
import { BaseEntity } from "./BaseEntity";
import { Sequence } from "./Sequence";

export type ProjectId = string;

export interface Project extends BaseEntity {
  id: ProjectId;
  code: null;
  color?: string;
  description: string;
  shotgun_id: string | null;
  file_tree: null;
  data?: { tags?: string[] };
  has_avatar: boolean;
  fps: string;
  ratio: string;
  resolution: string;
  production_type: "short";
  start_date: "2021-09-01";
  end_date: "2021-10-22";
  man_days: null;
  nb_episodes: number;
  episode_span: number;
  project_status_id: "9739b5a5-f3c1-402b-bdd1-78fa698165fd";
  type: "Project";

  sequences: Sequence[];
  assets: Asset[];
  total_frames: number;
}
