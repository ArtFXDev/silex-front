import { BaseEntity } from "./BaseEntity";

export interface Person extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  active: boolean;
  last_presence: string | null;
  desktop_login: string;
  shotgun_id: string | null;
  timezone: string;
  locale: string;
  data: unknown;
  role: string;
  has_avatar: boolean;
  notifications_enabled: boolean;
  notifications_slack_enabled: boolean;
  notifications_slack_userid: string;
  full_name: string;
}
