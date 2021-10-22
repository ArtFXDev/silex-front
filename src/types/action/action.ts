/* eslint-disable camelcase */
import { DCCContext } from "./context";
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

/**
 * A command is a piece of code with parameters
 */
export type Command = CommonFields & {
  path: string;
  status: Status;
  ask_user: boolean;
  parameters: { [paramName: string]: Parameter };
};

/**
 * A step is a list of commands
 */
export type Step = CommonFields & {
  status: Status;
  commands: { [commandName: string]: Command };
};

/**
 * An action is the whole object sent by the silex_client library running in the DCC
 */
export interface Action {
  name: string;
  context_metadata: DCCContext;
  steps: { [stepName: string]: Step };
  uuid: string;
}
