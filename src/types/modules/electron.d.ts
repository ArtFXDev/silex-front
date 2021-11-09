type IPCSendChannel =
  | "bringWindowToFront"
  | "getBladeStatus"
  | "setNimbyStatus"
  | "setNimbyAutoMode";

type IPCReceiveChannel = "bladeStatusUpdate";

export declare global {
  interface Window {
    electron: {
      send: (channel: IPCSendChannel, data?: unknown) => void;
      receive: <T>(
        channel: IPCReceiveChannel,
        callback: (data: T) => void
      ) => void;
    };
  }
}
