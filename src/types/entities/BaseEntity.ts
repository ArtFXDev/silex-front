export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: string;
}

export type EntityType = BaseEntity;
