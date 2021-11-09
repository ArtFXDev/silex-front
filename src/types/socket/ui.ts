import { Socket } from "socket.io-client";
import { Action } from "types/action/action";
import { DCCContext } from "types/action/context";

import {
  EmitWithCallback,
  Listener,
  ServerResponseWithData,
  WithCallback,
} from "./events";

export interface UIClientEmitEvents {
  /** Emit this to register the UI as a client */
  initialization: EmitWithCallback<{ uuid: string }>;

  /** Used to get the list of the connected dcc clients */
  getClients: WithCallback<
    ServerResponseWithData<{ [uuid: string]: DCCContext }>
  >;

  // Action related events
  getCurrentAction: WithCallback<ServerResponseWithData<Action>>;
  actionUpdate: EmitWithCallback<Action>;

  getWorkingFilesForTask: EmitWithCallback<
    { taskId: string },
    ServerResponseWithData<{ path: string; files: string[] }>
  >;

  launchScene: EmitWithCallback<{
    taskId: string;
    scene?: string;
    dcc: string;
    path?: string;
    projectName: string;
  }>;

  launchAction: EmitWithCallback<{
    action: string;
    taskId: string;
    dcc?: string;
    projectName: string;
  }>;
}

export interface UIOnServerEvents {
  dccConnect: Listener<{ uuid: string; context: DCCContext }>;
  dccDisconnect: Listener<{ uuid: string }>;

  // Action related events
  clearAction: Listener<{ uuid: string }>;
  actionQuery: Listener<Action>;
  actionUpdate: Listener<Action | undefined>;
}

export type UINamespaceSocket = Socket<UIOnServerEvents, UIClientEmitEvents>;
