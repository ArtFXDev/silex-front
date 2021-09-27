import { Socket } from "socket.io-client";
import { DCCClient } from "./DCCClient";

type ServerPayload<T> = { status: number; data: T };
type ServerResponse = { status: number; msg: string };

/** Callback function */
type Acknowledgement<Response> = (payload: ServerPayload<Response>) => void;

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
  getClients: WithCallback<{ [uuid: string]: DCCClient }>;
}

export interface OnServerEvents {
  dccConnect: (payload: DCCClient) => void;
  dccDisconnect: (uuid: string) => void;
}

export type TypedSocket = Socket<OnServerEvents, ClientEmitEvents>;
