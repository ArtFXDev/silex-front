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

  // TODO: refactor types
  // ls: (taskId: string, ack: (paths: { data: string[] }) => void) => void;
  // exec: (command: string, ack: (response: ServerResponse) => void) => void;
}

export interface UIOnServerEvents {
  dccConnect: Listener<{ uuid: string; context: DCCContext }>;
  dccDisconnect: Listener<{ uuid: string }>;

  // Action related events
  actionQuery: Listener<Action>;
  actionUpdate: Listener<Action | undefined>;
}

export type UINamespaceSocket = Socket<UIOnServerEvents, UIClientEmitEvents>;
