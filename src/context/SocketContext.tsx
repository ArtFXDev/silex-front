import { useSnackbar } from "notistack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { DCCContext } from "types/action/context";
import { UINamespaceSocket, UIOnServerEvents } from "types/socket";
import { v4 as uuidv4 } from "uuid";

export interface SocketContext {
  /** socket.io socket object (with types) */
  uiSocket: UINamespaceSocket;

  /** Array of dcc clients */
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

export const ProvideSocket = ({
  children,
}: ProvideSocketProps): JSX.Element => {
  const [uiSocket] = useState<UINamespaceSocket>(
    io(`${process.env.REACT_APP_WS_SERVER}/ui`, { reconnectionDelay: 2000 })
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dccClients, setDCCClients] = useState<DCCContext[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const onConnect = useCallback(() => {
    uiSocket.emit("initialization", { uuid: uuidv4() }, (response) => {
      setIsConnected(true);
      enqueueSnackbar(
        `Connected to ${process.env.REACT_APP_WS_SERVER} (${response.msg})`,
        {
          variant: "success",
        }
      );
    });

    uiSocket.emit("getClients", (response) => {
      if (response.data) {
        setDCCClients(Object.values(response.data));
      }
    });
  }, [enqueueSnackbar, uiSocket]);

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

  const onDCCConnect = useCallback<UIOnServerEvents["dccConnect"]>(
    (response) => {
      if (response.data) {
        const { context } = response.data;
        setDCCClients([...dccClients, context]);

        if (context.dcc) {
          enqueueSnackbar(
            `New dcc connected: ${context.dcc} - ${context.pid}`,
            {
              variant: "info",
            }
          );
        }
      }
    },
    [dccClients, enqueueSnackbar]
  );

  const onDCCDisconnect = useCallback<UIOnServerEvents["dccDisconnect"]>(
    (response) => {
      if (response.data) {
        const { uuid } = response.data;

        const disconnected = dccClients.find(
          (e) => e.uuid === uuid
        ) as DCCContext;
        setDCCClients(dccClients.filter((e) => e.uuid !== uuid));

        if (disconnected.dcc) {
          enqueueSnackbar(
            `dcc disconnected: ${disconnected.dcc} - ${disconnected.pid}`,
            {
              variant: "warning",
            }
          );
        }
      }
    },
    [dccClients, enqueueSnackbar]
  );

  useEffect(() => {
    // Register on events
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
    uiSocket,
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
