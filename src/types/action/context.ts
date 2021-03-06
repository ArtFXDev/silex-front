/**
 * Context data structure representing the current scene in the DCC
 */
export interface DCCContext {
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

  // Unique id for that socket connection
  socketId: string;
}
