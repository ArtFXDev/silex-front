export type ServerResponse<Data = undefined> = {
  msg: string;
  data?: Data;
  status: number;
};

export type Listener<Request> = (response: { data: Request }) => void;

/** Callback function */
export type Acknowledgement<Response> = (response: Response) => void;

/** Emit without a payload where you only need a response */
export type WithCallback<Response = ServerResponse> = (
  ack: Acknowledgement<Response>
) => void;

/** Emit with a payload and receive a response with a callback */
export type EmitWithCallback<Payload, Response = ServerResponse> = (
  payload: Payload,
  ack: Acknowledgement<Response>
) => void;
