import { Socket } from "socket.io-client";
import { Action } from "types/action/action";
import { DCCContext } from "types/action/context";

type ServerResponse<Data = undefined> = {
  data: Data | undefined;
  status: number;
  msg: string;
};

/** Callback function */
type Acknowledgement<Response> = (response: Response) => void;

/** Emit without a payload where you only need a response */
type WithCallback<Response> = (ack: Acknowledgement<Response>) => void;

/** Emit with a payload and receive a response with a callback */
type EmitWithCallback<Payload, Response> = (
  payload: Payload,
  ack: Acknowledgement<Response>
) => void;

export interface ClientEmitEvents {
  /** Emit this to register the UI as a client */
  initialization: EmitWithCallback<{ uuid: string }, ServerResponse>;

  /** Used to get the list of the connected dcc clients */
  getClients: WithCallback<{ [uuid: string]: DCCContext }>;

  // Action related events
  getCurrentAction: WithCallback<ServerResponse<Action>>;
  actionUpdate: EmitWithCallback<Action, ServerResponse>;
}

export interface OnServerEvents {
  dccConnect: (data: { uuid: string; context: DCCContext }) => void;
  dccDisconnect: (data: { uuid: string }) => void;

  // Action related events
  actionQuery: (action: { data: Action }) => void;
  actionUpdate: (updatedAction: { data: Action | undefined }) => void;
}

export type TypedSocket = Socket<OnServerEvents, ClientEmitEvents>;
