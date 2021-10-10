import { useSocket } from "context";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Action } from "types/action/action";
import { OnServerEvents } from "types/socket/events";

export interface ActionContext {
  action: Action | undefined;
}

export const ActionContext = React.createContext<ActionContext>(
  {} as ActionContext
);

interface ProvideActionProps {
  children: JSX.Element;
}

/**
 * The ProvideAction provides the current action context and handle action updates
 */
export const ProvideAction = ({
  children,
}: ProvideActionProps): JSX.Element => {
  const [action, setAction] = useState<Action>();

  const history = useHistory();
  const { socket } = useSocket();

  const setActionAndRedirect = useCallback(
    (action: Action) => {
      setAction(action);
      // Redirect to the action page
      history.push("/action");
    },
    [history]
  );

  /**
   * On socketio connect, retrieve the current action if exists
   */
  const onConnect = useCallback(() => {
    socket.emit("getCurrentAction", (currentAction) => {
      if (currentAction.data) {
        setActionAndRedirect(currentAction.data);
      }
    });
  }, [setActionAndRedirect, socket]);

  /**
   * Called when receiving an action from the server
   */
  const onActionQuery = useCallback<OnServerEvents["actionQuery"]>(
    (action) => {
      setActionAndRedirect(action.data);
    },
    [setActionAndRedirect]
  );

  /**
   * Called when receiving updates on the current action from the server
   */
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
