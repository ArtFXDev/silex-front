export interface IPCSendEvents {
  bringWindowToFront: () => void;
}

export declare global {
  interface Window {
    electron: {
      send: (event: keyof IPCSendEvents, data?: unknown) => void;
    };
  }
}
