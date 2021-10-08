import { DCCContext } from "./context";
import { Status } from "./status";

interface CommonFields {
  hide: boolean;
  index: number;
  label: string;
  name: string;
  tooltip: string;
  uuid: string;
}

export type Parameter = {
  label: string;
  name: string;
  type: "str" | "int" | null;
  value: string;
};

export type Command = CommonFields & {
  path: string;
  status: Status;
  ask_user: boolean;
  parameters: { [paramName: string]: Parameter };
};

export type Step = CommonFields & {
  status: Status;
  commands: { [commandName: string]: Command };
};

export interface Action {
  name: string;
  context_metadata: DCCContext;
  steps: { [stepName: string]: Step };
  uuid: string;
}
