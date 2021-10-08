import { useSnackbar } from "notistack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { DCCContext } from "types/action/context";
import { OnServerEvents, TypedSocket } from "types/socket";
import { v4 as uuidv4 } from "uuid";

export interface SocketContext {
  /** socket.io socket object (with types) */
  socket: TypedSocket;
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
  const [socket] = useState<TypedSocket>(
    io(`${process.env.REACT_APP_WS_SERVER}/ui`, { reconnectionDelay: 2000 })
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dccClients, setDCCClients] = useState<DCCContext[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const onConnect = useCallback(() => {
    socket.emit("initialization", { uuid: uuidv4() }, (response) => {
      setIsConnected(true);
      enqueueSnackbar(
        `Connected to ${process.env.REACT_APP_WS_SERVER} (${response.msg})`,
        {
          variant: "success",
        }
      );
    });

    socket.emit("getClients", (response) => {
      setDCCClients(Object.values(response.data));
    });
  }, [enqueueSnackbar, socket]);

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

  const onDCCConnect = useCallback<OnServerEvents["dccConnect"]>(
    (data) => {
      setDCCClients([...dccClients, data.context]);

      enqueueSnackbar(
        `New dcc connected: ${data.context.dcc} - ${data.context.pid}`,
        {
          variant: "info",
        }
      );
    },
    [dccClients, enqueueSnackbar]
  );

  const onDCCDisconnect = useCallback<OnServerEvents["dccDisconnect"]>(
    (data) => {
      const disconnected = dccClients.find(
        (e) => e.uuid === data.uuid
      ) as DCCContext;
      setDCCClients(dccClients.filter((e) => e.uuid !== data.uuid));

      enqueueSnackbar(
        `dcc disconnected: ${disconnected.dcc} - ${disconnected.pid}`,
        {
          variant: "warning",
        }
      );
    },
    [dccClients, enqueueSnackbar]
  );

  useEffect(() => {
    // Register on events
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("dccConnect", onDCCConnect);
    socket.on("dccDisconnect", onDCCDisconnect);

    return () => {
      // Cleanup function remove the ws listeners
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("dccConnect", onDCCConnect);
      socket.off("dccDisconnect", onDCCDisconnect);
    };
  }, [
    dccClients,
    socket,
    enqueueSnackbar,
    onConnect,
    onDisconnect,
    onDCCConnect,
    onDCCDisconnect,
  ]);

  return (
    <socketContext.Provider
      value={{
        socket,
        isConnected,
        dccClients,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

export const useSocket = (): SocketContext => useContext(socketContext);
