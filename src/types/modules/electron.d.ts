type IPCSendChannel =
  | "bringWindowToFront"
  | "getBladeStatus"
  | "setNimbyStatus"
  | "setNimbyAutoMode"
  | "killAllActiveTasksOnBlade"
  | "openFolderOrFile";

type IPCReceiveChannel =
  | "bladeStatusUpdate"
  | "operationError"
  | "operationSuccess";

export declare global {
  interface Window {
    electron: {
      send: (channel: IPCSendChannel, data?: unknown) => void;
      receive: <T>(
        channel: IPCReceiveChannel,
        callback: (data: T) => void
      ) => void;
      removeListener: (
        channel: IPCReceiveChannel,
        fun: (data: any) => void
      ) => void;
    };
  }
}
