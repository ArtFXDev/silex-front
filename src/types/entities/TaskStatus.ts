/* eslint-disable camelcase */
import { BaseEntity } from "types/entities";

export interface TaskStatus extends BaseEntity {
  short_name: string;
  color: string;
  is_done: boolean;
  is_artist_allowed: boolean;
  is_client_allowed: boolean;
  is_retake: boolean;
  is_reviewable: boolean;
}
