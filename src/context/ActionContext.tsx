import { useSocket } from "context";
import merge from "deepmerge";
import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { useHistory } from "react-router";
import { Action } from "types/action/action";
import { Status } from "types/action/status";
import { ServerResponse, UIOnServerEvents } from "types/socket";
import { diff } from "utils/diff";
import { runIfInElectron } from "utils/electron";

export interface ActionContext {
  /** The dict of running actions */
  actions: {
    [uuid: Action["uuid"]]: {
      action: Action; // The action object
      finished: boolean; // Either the action is finished or not
      oldAction: Action; // Action backup in order to diff it with the updated state
    };
  };

  /** Used to clear an action given its uuid */
  clearAction: (uuid: Action["uuid"]) => void;

  /** Clean all finished actions */
  cleanActions: () => void;

  /** Send an action update when modifying a parameter */
  sendActionUpdate: (
    uuid: string,
    removeAskUser: boolean,
    callback?: (data: ServerResponse) => void
  ) => void;
}

export const ActionContext = React.createContext<ActionContext>(
  {} as ActionContext
);

// The global dict of actions
// It's stored outside the component but normally it shouldn't
const actions: ActionContext["actions"] = {};

function addNewAction(action: Action) {
  const deepActionCopy = JSON.parse(JSON.stringify(action));
  actions[action.uuid] = { action, oldAction: deepActionCopy, finished: false };
}

interface ProvideActionProps {
  children: JSX.Element;
}

/**
 * The ProvideAction provides the current action context and handle action updates
 */
export const ProvideAction = ({
  children,
}: ProvideActionProps): JSX.Element => {
  // Hack to force the update when the actions change because the state is outside the component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const history = useHistory();
  const { uiSocket } = useSocket();

  /**
   * Clears an action
   */
  const clearAction = (uuid: Action["uuid"]) => {
    delete actions[uuid];
    forceUpdate();
  };

  /**
   * Clean actions that are finished
   */
  const cleanActions = () => {
    // Filter actions that are finished
    const toClean = Object.keys(actions).filter(
      (uuid) => actions[uuid].finished
    );
    toClean.forEach((uuid) => clearAction(uuid));
  };

  /**
   * Called on connection with the socket server
   * It gets all the running actions
   */
  const onConnect = useCallback(() => {
    uiSocket.emit("getRunningActions", (response) => {
      if (response.data) {
        Object.values(response.data).forEach(addNewAction);
        forceUpdate();
      }
    });
  }, [uiSocket]);

  /**
   * Called when receiving an action from a client
   */
  const onActionQuery = useCallback<UIOnServerEvents["actionQuery"]>(
    (newAction) => {
      // Store this new action
      addNewAction(newAction.data);

      // Redirect to the specific action page
      history.push(`/action/${newAction.data.uuid}`);

      // Brings the dektop app on top
      runIfInElectron(() => window.electron.send("bringWindowToFront"));

      forceUpdate();
    },
    [history]
  );

  /**
   * Called when receiving updates on an action from the server
   */
  const onActionUpdate = useCallback<UIOnServerEvents["actionUpdate"]>(
    (actionDiff) => {
      const { uuid } = actionDiff.data;

      // Only keep the last version when merging arrays
      const arrayMerge: merge.Options["arrayMerge"] = (
        destinationArray,
        sourceArray
      ) => sourceArray;

      // Merge the diff
      actions[uuid].action = merge(actions[uuid].action, actionDiff.data, {
        arrayMerge,
      });

      // Also update the second version
      actions[uuid].oldAction = merge(
        actions[uuid].oldAction,
        actionDiff.data,
        { arrayMerge }
      );

      // Test if we scroll to the next command
      if (actions[uuid] && actions[uuid].action) {
        // Sort the commands by status code
        const allCommands = Object.values(actions[uuid].action.steps)
          .map((s) => Object.values(s.commands))
          .flat();

        if (allCommands.length > 0) {
          const sortedCommands = allCommands.sort(
            (a, b) => a.status - b.status
          );

          const allCommandsAreWaitingForResponse = !sortedCommands.some(
            (cmd) => cmd.status !== Status.WAITING_FOR_RESPONSE
          );

          if (!allCommandsAreWaitingForResponse) {
            // Get the last one
            const lastCommand = sortedCommands[sortedCommands.length - 1];

            // Scroll to that specific id element
            document.getElementById(`cmd-${lastCommand.uuid}`)?.scrollIntoView({
              behavior: "smooth",
              inline: "start",
              block: "start",
            });
          }
        }
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
        if (action.action.context_metadata.uuid === uuid) {
          // Clean actions when not on the page
          if (!window.location.pathname.startsWith("/action")) {
            delete actions[action.action.uuid];
          } else {
            actions[action.action.uuid].finished = true;
          }
        }
      });

      forceUpdate();
    },
    []
  );

  /**
   * Called when when we receive the information that an action was finished
   */
  const onClearAction = useCallback<UIOnServerEvents["clearAction"]>(
    (response) => {
      // Mark the action as finished
      actions[response.data.uuid].finished = true;

      forceUpdate();
    },
    []
  );

  const sendActionUpdate = (
    uuid: string,
    removeAskUser: boolean,
    callback?: (data: ServerResponse) => void
  ) => {
    if (actions[uuid] !== undefined) {
      if (removeAskUser) {
        // Manually set the ask_user fields to false
        for (const step of Object.values(actions[uuid].action.steps)) {
          for (const cmd of Object.values(step.commands)) {
            if (cmd.status === Status.WAITING_FOR_RESPONSE) {
              // eslint-disable-next-line camelcase
              cmd.ask_user = false;
            }
          }
        }
      }

      // Compute the diff
      const actionDiff = diff(actions[uuid].oldAction, actions[uuid].action);

      // Manually add the action uuid to the diff
      // so we can apply the diff to the correct action
      actionDiff.uuid = uuid;

      // Send the diff to the socket server
      uiSocket.emit("actionUpdate", actionDiff, callback || (() => undefined));
    }
  };

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
        clearAction,
        cleanActions,
        sendActionUpdate,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = (): ActionContext => useContext(ActionContext);
