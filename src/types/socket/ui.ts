import { Socket } from "socket.io-client";

import { Action } from "~/types/action/action";
import { DCCContext } from "~/types/action/context";

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
}

export type LaunchActionParameters = SilexBaseParameters & {
  action: string;
};

export type LaunchSceneParameters = SilexBaseParameters & {
  scene?: string;
};

export type FileOrFolder =
  | {
      isSequence: boolean;
      isDirectory: boolean;
      path: string;
      name: string;
      mtime: string;
      extension?: string;
      start?: number;
      end?: number;
    }
  | {
      isSequence: true;
      isDirectory: false;
      path: string;
      name: string;
      extension: string;
      start: number;
      end: number;
      mtime: string;
    };

export interface UIClientEmitEvents {
  /** Emit this to register the UI as a client */
  initialization: EmitWithCallback<{ uuid: string }>;

  /** Used to get the list of the connected dcc clients */
  getConnectedDccs: WithCallback<
    ServerResponse<{ [uuid: string]: DCCContext }>
  >;

  getRunningActions: WithCallback<ServerResponse<{ [uuid: string]: Action }>>;
  actionUpdate: EmitWithCallback<Action>;

  searchDirRecursive: EmitWithCallback<
    { path: string; extensions: string[]; ignore?: string[] },
    ServerResponse<{ files: FileOrFolder[] }>
  >;

  readDir: EmitWithCallback<
    { path: string; includeHiddenFiles?: boolean },
    ServerResponse<{ entries: FileOrFolder[] }>
  >;

  pullPublishedScene: EmitWithCallback<
    { publishedFilePath: string },
    ServerResponse<unknown>
  >;

  copyFile: EmitWithCallback<
    { source: string; destination: string; errorOnDestExist?: boolean },
    ServerResponse<{ destination: string }>
  >;

  launchScene: EmitWithCallback<LaunchSceneParameters>;

  launchAction: EmitWithCallback<LaunchActionParameters>;

  clearAction: EmitWithCallback<{ uuid: string }>;
  undoLastCommand: EmitWithCallback<{ uuid: string }>;

  killProcess: EmitWithCallback<{ pid: number }>;
}

type SilexCoinsEvent = {
  type: "silexCoins";
  data: {
    new_coins: number;
  };
};

type FrontEvent = SilexCoinsEvent;

export interface UIOnServerEvents {
  dccConnect: Listener<{ uuid: string; context: DCCContext }>;
  dccDisconnect: Listener<{ uuid: string }>;

  // Action related events
  clearAction: Listener<{ uuid: string }>;
  actionQuery: Listener<Action>;
  actionUpdate: Listener<Partial<Action> & { uuid: string }>;

  // Special events
  frontEvent: Listener<FrontEvent>;
}

export type UINamespaceSocket = Socket<UIOnServerEvents, UIClientEmitEvents>;
