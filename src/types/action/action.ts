/* eslint-disable camelcase */
import { Parameter } from "./parameters";
import { Status } from "./status";

/**
 * Common fields used by the types below
 */
interface CommonFields {
  hide: boolean;
  index: number;
  label: string;
  name: string;
  tooltip: string | null;
  uuid: string;
}

export type LogLine = {
  level?: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL" | "TRACEBACK";
  message: string;
};

/**
 * A command is a piece of code with parameters
 */
export type Command = CommonFields & {
  path: string;
  status: Status;
  ask_user: boolean;
  parameters: { [paramName: string]: Parameter };
  logs: LogLine[];
};

/**
 * A step is a list of commands
 */
export type Step = CommonFields & {
  status: Status;
  commands: { [commandName: string]: Command };
};

export interface ActionContext {
  asset?: string;
  dcc?: string;
  name?: string;
  pid: number;
  project?: string;
  project_id?: string;
  sequence?: string;
  sequence_id?: string;
  shot?: string;
  shot_id?: string;
  task?: string;
  task_id?: string;
  task_type?: string;
  user?: string;
  user_email?: string;
  uuid?: string;
}

/**
 * An action is the whole object sent by the silex_client library running in the DCC
 */
export interface Action {
  name: string;
  label: string;
  status: Status;
  context_metadata: ActionContext;
  steps: { [stepName: string]: Step };
  uuid: string;
}
