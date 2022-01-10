// IPC messages we can send to Electron through the exposed send function
type IPCSendChannel =
  | "bringWindowToFront"
  | "getBladeStatus"
  | "setNimbyStatus"
  | "setNimbyAutoMode"
  | "killAllActiveTasksOnBlade"
  | "openPath"
  | "pathExists"
  | "mkdir";

// IPC messages we can receive from Electron
type IPCReceiveChannel =
  | "bladeStatusUpdate"
  | "operationError"
  | "operationSuccess";

type IPCSend = (channel: IPCSendChannel, data?: unknown) => unknown;

/**
 * These are electron functions exposed through the context bridge.
 * See: silex-desktop/src/windows/main/preload.js
 */
export declare global {
  interface Window {
    electron: {
      send: IPCSend;
      sendSync: IPCSend;

      receive: <T>(
        channel: IPCReceiveChannel,
        callback: (data: T) => void
      ) => void;
      removeListener: (
        channel: IPCReceiveChannel,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fun: (data: any) => void
      ) => void;
    };
  }
}
