import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { useSocket } from "context";
import { Action } from "types/action/action";
import { OnServerEvents } from "types/socket";

export interface ActionContext {
  action: Action | undefined;
}

export const ActionContext = React.createContext<ActionContext>(
  {} as ActionContext
);

export const ProvideAction: React.FC = ({ children }) => {
  const [action, setAction] = useState<Action>();

  const history = useHistory();
  const { socket } = useSocket();

  const onConnect = useCallback(() => {
    socket.emit("getCurrentAction", (currentAction) => {
      if (currentAction.data) {
        setAction(currentAction.data);
        history.push("/action");
      }
    });
  }, [history, socket]);

  const onActionQuery = useCallback<OnServerEvents["actionQuery"]>(
    (action) => {
      setAction(action.data);
      history.push("/action");
    },
    [history]
  );

  const onActionUpdate = useCallback<OnServerEvents["actionUpdate"]>(
    (updatedAction) => {
      setAction(updatedAction.data);
    },
    []
  );

  useEffect(() => {
    socket.on("connect", onConnect);

    socket.on("actionQuery", onActionQuery);
    socket.on("actionUpdate", onActionUpdate);

    return () => {
      socket.off("connect", onConnect);

      socket.off("query", onActionQuery);
      socket.off("update", onActionUpdate);
    };
  }, [socket, onConnect, onActionQuery, onActionUpdate]);

  return (
    <ActionContext.Provider
      value={{
        action,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = (): ActionContext => useContext(ActionContext);
