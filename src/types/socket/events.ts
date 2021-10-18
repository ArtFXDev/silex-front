export type ServerResponse = { status: number; msg: string };

export type ServerResponseWithData<Data> = {
  data?: Data;
  status: 200;
  msg: string;
};

export type Listener<Request> = (response: { data: Request }) => void;

/** Callback function */
type Acknowledgement<Response> = (response: Response) => void;

/** Emit without a payload where you only need a response */
export type WithCallback<Response = ServerResponse> = (
  ack: Acknowledgement<Response>
) => void;

/** Emit with a payload and receive a response with a callback */
export type EmitWithCallback<Payload, Response = ServerResponse> = (
  payload: Payload,
  ack: Acknowledgement<Response>
) => void;
