import { useSnackbar } from "notistack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { DCCContext } from "types/action/context";
import { UINamespaceSocket, UIOnServerEvents } from "types/socket";
import { v4 as uuidv4 } from "uuid";

export interface SocketContext {
  /** socket.io socket object (with types) */
  uiSocket: UINamespaceSocket;

  /** List of dcc clients */
  dccClients: DCCContext[];

  /** Wether the ui is connected to the ws server */
  isConnected: boolean;
}

export const socketContext = React.createContext<SocketContext>(
  {} as SocketContext
);

interface ProvideSocketProps {
  children: JSX.Element;
}

// Initialize a global socket instance
export const uiSocket: UINamespaceSocket = io(
  `${process.env.REACT_APP_WS_SERVER}/ui`,
  { reconnectionDelay: 2000 }
);

export const ProvideSocket = ({
  children,
}: ProvideSocketProps): JSX.Element => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dccClients, setDCCClients] = useState<DCCContext[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  /**
   * Called when the UI is connected
   */
  const onConnect = useCallback(() => {
    // Initialize the UI itself
    uiSocket.emit("initialization", { uuid: uuidv4() }, (response) => {
      // If we got a response we are connected
      setIsConnected(true);

      // Then ask for the list of connected clients
      uiSocket.emit("getConnectedDccs", (response) => {
        setDCCClients(Object.values(response.data));
      });

      enqueueSnackbar(
        `Connected to ${process.env.REACT_APP_WS_SERVER} (${response.msg})`,
        {
          variant: "success",
        }
      );
    });
  }, [enqueueSnackbar]);

  /**
   * Called when the UI is disconnected from the WS server
   */
  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    setDCCClients([]);

    enqueueSnackbar(
      `WS server ${process.env.REACT_APP_WS_SERVER} disconnected`,
      {
        variant: "error",
      }
    );
  }, [enqueueSnackbar]);

  /**
   * Called when a new dcc client is connected
   */
  const onDCCConnect = useCallback<UIOnServerEvents["dccConnect"]>(
    (response) => {
      const { context } = response.data;

      if (!dccClients.some((c) => c.pid === context.pid)) {
        setDCCClients([...dccClients, context]);
      }

      // Only display a notif when it's a real dcc (not standalone)
      if (context.dcc) {
        enqueueSnackbar(`New dcc connected: ${context.dcc} - ${context.pid}`, {
          variant: "info",
        });
      }
    },
    [dccClients, enqueueSnackbar]
  );

  /**
   * Called when a dcc is disconnected
   */
  const onDCCDisconnect = useCallback<UIOnServerEvents["dccDisconnect"]>(
    (response) => {
      if (response.data) {
        const { uuid } = response.data;

        // Finds the disconnected client based on its uuid
        const disconnected = dccClients.find((e) => e.uuid === uuid);

        // If we found a missing client
        if (disconnected) {
          // Update the state to remove that client
          setDCCClients(dccClients.filter((e) => e.uuid !== uuid));

          // Only display a notif when it's a real dcc (not standalone)
          if (disconnected.dcc) {
            enqueueSnackbar(
              `dcc disconnected: ${disconnected.dcc} - ${disconnected.pid}`,
              {
                variant: "warning",
              }
            );
          }
        }
      }
    },
    [dccClients, enqueueSnackbar]
  );

  useEffect(() => {
    // Register "on" events
    uiSocket.on("connect", onConnect);
    uiSocket.on("disconnect", onDisconnect);

    uiSocket.on("dccConnect", onDCCConnect);
    uiSocket.on("dccDisconnect", onDCCDisconnect);

    return () => {
      // Cleanup function remove the ws listeners
      uiSocket.off("connect", onConnect);
      uiSocket.off("disconnect", onDisconnect);

      uiSocket.off("dccConnect", onDCCConnect);
      uiSocket.off("dccDisconnect", onDCCDisconnect);
    };
  }, [
    dccClients,
    enqueueSnackbar,
    onConnect,
    onDisconnect,
    onDCCConnect,
    onDCCDisconnect,
  ]);

  return (
    <socketContext.Provider
      value={{
        uiSocket,
        isConnected,
        dccClients,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

export const useSocket = (): SocketContext => useContext(socketContext);
