/* eslint-disable camelcase */
import { Parameter } from "./parameters";
import { Status } from "./status";

/**
 * The context of an action
 */
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
 * Common fields used by the types below
 */
export interface CommonFields {
  uuid: string;
  buffer_type: string;
  hide: boolean;
  index: number;
  label: string;
  name: string;
  tooltip: string | null;
}

export type LogLine = {
  level?: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL" | "TRACEBACK";
  message: string;
};

/**
 * A command is a collection of parameters and executes a Python script on the backend
 */
export type Command = CommonFields & {
  buffer_type: "commands";
  path: string;
  status: Status;
  ask_user: boolean;
  skip: boolean;
  children: { [paramName: string]: Parameter };
  logs: LogLine[];
};

/**
 * A step is a collection of commands
 */
export type Step = CommonFields & {
  buffer_type: "steps";
  status: Status;
  children: { [commandName: string]: Command };
};

/**
 * An action is the whole object sent by the silex_client library running in the DCC
 * It can have steps or nested actions
 */

export interface Action extends CommonFields {
  buffer_type: "actions";
  status: Status;
  context_metadata: ActionContext;
  children: { [name: string]: Step | Action };
}
