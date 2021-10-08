/* eslint-disable camelcase */
import { BaseEntity } from "./BaseEntity";

export interface TaskType extends BaseEntity {
  short_name: string;
  color: string;
  priority: number;
  for_shots: boolean;
  for_entity: string;
  allow_timelog: boolean;
  department_id: string;
}
