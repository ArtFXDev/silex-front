import { useSocket } from "context";
import merge from "deepmerge";
import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { useHistory } from "react-router";
import { Action } from "types/action/action";
import { UIOnServerEvents } from "types/socket";
import { runIfInElectron } from "utils/electron";

export interface ActionContext {
  /** The dict of running actions */
  actions: { [uuid: Action["uuid"]]: Action };

  /** Wether or not an action is finished */
  actionStatuses: { [uuid: Action["uuid"]]: boolean };

  /** Used to clear an action given its uuid */
  clearAction: (uuid: Action["uuid"]) => void;

  /** Clean all finished actions */
  cleanActions: () => void;
}

export const ActionContext = React.createContext<ActionContext>(
  {} as ActionContext
);

interface ProvideActionProps {
  children: JSX.Element;
}

const actions: ActionContext["actions"] = {};
const actionStatuses: ActionContext["actionStatuses"] = {};

/**
 * The ProvideAction provides the current action context and handle action updates
 */
export const ProvideAction = ({
  children,
}: ProvideActionProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const history = useHistory();
  const { uiSocket } = useSocket();

  /**
   * Clears an action
   */
  const clearAction = (uuid: Action["uuid"]) => {
    delete actions[uuid];
    delete actionStatuses[uuid];
    forceUpdate();
  };

  /**
   * Clean actions that are finished
   */
  const cleanActions = () => {
    // Filter actions that are finished
    const toClean = Object.keys(actionStatuses).filter(
      (uuid) => actionStatuses[uuid]
    );
    toClean.forEach((uuid) => clearAction(uuid));
  };

  /**
   * Called on connection
   * Gets all the running actions
   */
  const onConnect = useCallback(() => {
    uiSocket.emit("getRunningActions", (response) => {
      Object.values(response.data).forEach((action) => {
        actions[action.uuid] = action;
        actionStatuses[action.uuid] = false;
      });

      forceUpdate();
    });
  }, [uiSocket]);

  /**
   * Called when receiving an action from a client
   */
  const onActionQuery = useCallback<UIOnServerEvents["actionQuery"]>(
    (newAction) => {
      // Add a new action
      actions[newAction.data.uuid] = newAction.data;

      // Redirect to the specific action page
      history.push(`/action/${newAction.data.uuid}`);

      // Brings the dektop app on top
      runIfInElectron(() => window.electron.send("bringWindowToFront"));

      forceUpdate();
    },
    [history]
  );

  /**
   * Called when receiving updates on the current action from the server
   */
  const onActionUpdate = useCallback<UIOnServerEvents["actionUpdate"]>(
    (actionDiff) => {
      const { uuid } = actionDiff.data;

      // Merge the diff
      const mergedAction = merge(actions[uuid], actionDiff.data, {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        arrayMerge: (destinationArray, sourceArray, options) => sourceArray,
      });

      // Update the state
      actions[uuid] = mergedAction;

      // Test if we scroll to the next command
      if (actions[uuid] && mergedAction) {
        // Sort the commands by status code
        const sortedCommands = Object.values(mergedAction.steps)
          .map((s) => Object.values(s.commands))
          .flat()
          .sort((a, b) => a.status - b.status);

        // Get the last one
        const lastCommand = sortedCommands[sortedCommands.length - 1];

        // Scroll to that specific id element
        document.getElementById(`cmd-${lastCommand.uuid}`)?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center",
        });
      }

      forceUpdate();
    },
    []
  );

  /**
   * Called when a client is disconnected
   */
  const onClientDisconnect = useCallback<UIOnServerEvents["dccDisconnect"]>(
    (response) => {
      const { uuid } = response.data;

      // Mark the action as finished
      Object.values(actions).forEach((action) => {
        // If the context uuid matches with that disconnected client
        if (action.context_metadata.uuid === uuid) {
          actionStatuses[action.uuid] = true;
        }
      });

      forceUpdate();
    },
    []
  );

  /**
   * Called when a user
   */
  const onClearAction = useCallback<UIOnServerEvents["clearAction"]>(
    (response) => {
      // Mark the action as finished
      actionStatuses[response.data.uuid] = true;

      forceUpdate();
    },
    []
  );

  useEffect(() => {
    uiSocket.on("connect", onConnect);

    uiSocket.on("actionQuery", onActionQuery);
    uiSocket.on("actionUpdate", onActionUpdate);
    uiSocket.on("clearAction", onClearAction);

    uiSocket.on("dccDisconnect", onClientDisconnect);

    return () => {
      uiSocket.off("connect", onConnect);

      uiSocket.off("actionQuery", onActionQuery);
      uiSocket.off("actionUpdate", onActionUpdate);
      uiSocket.off("clearAction", onClearAction);

      uiSocket.off("dccDisconnect", onClientDisconnect);
    };
  }, [
    uiSocket,
    onActionQuery,
    onActionUpdate,
    onClientDisconnect,
    onConnect,
    onClearAction,
  ]);

  return (
    <ActionContext.Provider
      value={{
        actions,
        actionStatuses,
        clearAction,
        cleanActions,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = (): ActionContext => useContext(ActionContext);
