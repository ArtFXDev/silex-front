import { Socket } from "socket.io-client";
import { Action } from "types/action/action";
import { DCCContext } from "types/action/context";

import {
  EmitWithCallback,
  Listener,
  ServerResponse,
  WithCallback,
} from "./events";

export interface SilexBaseParameters {
  taskId?: string;
  dcc?: string;
  projectName?: string;
  mode?: "prod" | "beta" | "dev";
}

export type LaunchActionParameters = SilexBaseParameters & {
  action: string;
};

export type LaunchSceneParameters = SilexBaseParameters & {
  scene?: string;
};

export type FileOrFolder = {
  path: string;
} & (
  | {
      isDirectory: true;
      children: FileOrFolder[];
    }
  | { isDirectory: false }
);

export type FileData = {
  name: string;
  path: string;
  mtime: string;
};

export type GetWorkingFilesForTaskResponse = ServerResponse<{
  path: string;
  files: FileData[];
}>;

export interface UIClientEmitEvents {
  /** Emit this to register the UI as a client */
  initialization: EmitWithCallback<{ uuid: string }>;

  /** Used to get the list of the connected dcc clients */
  getConnectedDccs: WithCallback<
    ServerResponse<{ [uuid: string]: DCCContext }>
  >;

  getRunningActions: WithCallback<ServerResponse<{ [uuid: string]: Action }>>;
  actionUpdate: EmitWithCallback<Action>;

  getWorkingFilesForTask: EmitWithCallback<
    { taskId: string; searchExtensions: string[] },
    GetWorkingFilesForTaskResponse
  >;

  getPublishedFilesForTask: EmitWithCallback<
    { taskId: string },
    ServerResponse<{ publishStructure: FileOrFolder }>
  >;

  launchScene: EmitWithCallback<LaunchSceneParameters>;

  launchAction: EmitWithCallback<LaunchActionParameters>;

  clearAction: EmitWithCallback<{ uuid: string }>;
}

export interface UIOnServerEvents {
  dccConnect: Listener<{ uuid: string; context: DCCContext }>;
  dccDisconnect: Listener<{ uuid: string }>;

  // Action related events
  clearAction: Listener<{ uuid: string }>;
  actionQuery: Listener<Action>;
  actionUpdate: Listener<Partial<Action> & { uuid: string }>;
}

export type UINamespaceSocket = Socket<UIOnServerEvents, UIClientEmitEvents>;
