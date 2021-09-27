import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSnackbar } from "notistack";

import { TypedSocket, DCCClient } from "types/socket";

export interface SocketContext {
  /** socket.io socket object (with types) */
  socket: TypedSocket;
  /** Array of dcc clients */
  dccClients: DCCClient[];
  /** Wether the ui is connected to the ws server */
  isConnected: boolean;
}

export const socketContext = React.createContext<SocketContext>(
  {} as SocketContext
);

export const ProvideSocket: React.FC = ({ children }) => {
  const [socket] = useState<TypedSocket>(
    io(`${process.env.REACT_APP_WS_SERVER}/ui`, { reconnectionDelay: 2000 })
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dccClients, setDCCClients] = useState<DCCClient[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket.on("connect", () => {
      // TODO: random uuid
      socket.emit("initialization", { uuid: "fhksjfhkj" }, (response) => {});

      socket.emit("getClients", (response) => {
        setDCCClients(Object.values(response.data));
      });

      // Set the status to connected and display a notification
      setIsConnected(true);
      enqueueSnackbar(`Connected to ${process.env.REACT_APP_WS_SERVER}`, {
        variant: "success",
      });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("dccConnect", (data) => {
      setDCCClients([...dccClients, data]);
      enqueueSnackbar(`New dcc connected: ${data.dcc} - ${data.pid}`, {
        variant: "info",
      });
    });

    socket.on("dccDisconnect", (uuid) => {
      setDCCClients(dccClients.filter((e) => e.uuid !== uuid));

      const disconnected = dccClients.find((e) => e.uuid === uuid) as DCCClient;
      enqueueSnackbar(
        `dcc disconnected: ${disconnected.dcc} - ${disconnected.pid}`,
        {
          variant: "warning",
        }
      );
    });

    return () => {
      // Cleanup function remove the ws listeners
      socket.off("dccConnect");
      socket.off("dccDisconnect");
    };
  }, [dccClients, socket, enqueueSnackbar]);

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

export const useSocket = () => useContext(socketContext);
