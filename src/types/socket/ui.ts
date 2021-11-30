import { Socket } from "socket.io-client";
import { Action } from "types/action/action";
import { DCCContext } from "types/action/context";

import {
  EmitWithCallback,
  Listener,
  ServerResponseWithData,
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
  path?: string;
};

export interface UIClientEmitEvents {
  /** Emit this to register the UI as a client */
  initialization: EmitWithCallback<{ uuid: string }>;

  /** Used to get the list of the connected dcc clients */
  getConnectedDccs: WithCallback<
    ServerResponseWithData<{ [uuid: string]: DCCContext }>
  >;

  getRunningActions: WithCallback<
    ServerResponseWithData<{ [uuid: string]: Action }>
  >;
  actionUpdate: EmitWithCallback<Action>;

  getWorkingFilesForTask: EmitWithCallback<
    { taskId: string },
    ServerResponseWithData<{ path: string; files: string[] }>
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
