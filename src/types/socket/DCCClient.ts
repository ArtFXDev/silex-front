export interface DCCClient {
  asset: string | null;
  dcc: string | null;
  name: string | null;
  pid: number;
  project: string | null;
  sequence: string | null;
  shot: string | null;
  task: string | null;
  user: string;
  uuid: string;
}
