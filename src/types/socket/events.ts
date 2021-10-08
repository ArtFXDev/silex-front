import { Socket } from "socket.io-client";
import { DCCClient } from "./DCCClient";

type ServerResponse = { status: number; msg: string };

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
  getClients: WithCallback<{ [uuid: string]: DCCClient }>;

  // TODO: refactor types
  ls: (path: string, ack: (paths: { data: string[] }) => void) => void;
  exec: (command: string, ack: (response: ServerResponse) => void) => void;
}

export interface OnServerEvents {
  dccConnect: (data: { uuid: string; context: DCCClient }) => void;
  dccDisconnect: (data: { uuid: string }) => void;
}

export type TypedSocket = Socket<OnServerEvents, ClientEmitEvents>;
