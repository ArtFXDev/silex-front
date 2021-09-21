export type ProjectId = string;

export interface Project {
  created_at: string;
  data: unknown;
  end_date: string;
  episode_span: number;
  fps: number;
  has_avatar: boolean;
  id: ProjectId;
  name: string;
  nb_episodes: number;
  production_type: string;
  ratio: string;
  resolution: string;
  start_date: string;
}
