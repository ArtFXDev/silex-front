import { useSocket } from "context";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Action } from "types/action/action";
import { UIOnServerEvents } from "types/socket";

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
  const { uiSocket } = useSocket();

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
    uiSocket.emit("getCurrentAction", (currentAction) => {
      if (currentAction.data) {
        setActionAndRedirect(currentAction.data);
      }
    });
  }, [setActionAndRedirect, uiSocket]);

  /**
   * Called when receiving an action from the server
   */
  const onActionQuery = useCallback<UIOnServerEvents["actionQuery"]>(
    (action) => {
      if (action.data) setActionAndRedirect(action.data);
    },
    [setActionAndRedirect]
  );

  /**
   * Called when receiving updates on the current action from the server
   */
  const onActionUpdate = useCallback<UIOnServerEvents["actionUpdate"]>(
    (updatedAction) => {
      setAction(updatedAction.data);
    },
    []
  );

  useEffect(() => {
    uiSocket.on("connect", onConnect);

    uiSocket.on("actionQuery", onActionQuery);
    uiSocket.on("actionUpdate", onActionUpdate);

    return () => {
      uiSocket.off("connect", onConnect);

      uiSocket.off("query", onActionQuery);
      uiSocket.off("update", onActionUpdate);
    };
  }, [uiSocket, onConnect, onActionQuery, onActionUpdate]);

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
