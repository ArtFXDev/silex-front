import { BaseEntity } from "./BaseEntity";

export interface PreviewFile extends BaseEntity {
  data: null;
  original_name: string;
  revision: number;
  position: number;
  extension: string;
  description: string | null;
  path: string;
  source: string;
  file_size: number;
  status: string | null;
  annotations: string | null;
  task_id: string;
  person_id: string;
  source_file_id: string | null;
  is_movie: boolean | null;
  url: string | null;
  uploaded_movie_url: string | null;
  uploaded_movie_name: string | null;

  type: "PreviewFile";
}
