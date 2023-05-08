import merge from "deepmerge";
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router";

import { useSocket } from "~/context";
import { Action } from "~/types/action/action";
import { Status } from "~/types/action/status";
import { ServerResponse, UIOnServerEvents } from "~/types/socket";
import { diff } from "~/utils/diff";
import { runIfInElectron } from "~/utils/electron";

export interface ActionContext {
  /** The dict of running actions */
  actions: {
    [uuid: Action["uuid"]]: {
      action: Action; // The action object
      oldAction: Action; // Action backup in order to diff it with the updated state
    };
  };

  /** Used to clear an action given its uuid */
  clearAction: (uuid: Action["uuid"]) => void;

  /** Clean all finished actions */
  cleanActions: () => void;

  /** Sends an action update diff to the server */
  sendActionUpdate: (
    uuid: string,
    removeAskUser: boolean,
    callback?: (data: ServerResponse) => void
  ) => void;

  /** Returns true if the given action is finished */
  isActionFinished: (action: Action) => boolean;

  /** Used to simplify the action view */
  simpleMode: boolean;
  setSimpleMode: (newValue: boolean) => void;
}

export const ActionContext = React.createContext<ActionContext>(
  {} as ActionContext
);

// The global dict of actions
// It's stored outside the component but normally it shouldn't
const actions: ActionContext["actions"] = {};

/**
 * Adds a new action to the store
 */
function addNewAction(action: Action) {
  let keys = Object.keys(actions);

  // Don't allow more than a certain number of tabs
  while (keys.length >= 10) {
    delete actions[keys[0]];
    keys = Object.keys(actions);
  }

  // Deep copy to have an action clone for diffs
  const deepActionCopy = JSON.parse(JSON.stringify(action));
  actions[action.uuid] = { action, oldAction: deepActionCopy };
}

interface ProvideActionProps {
  children: JSX.Element;
}

/**
 * Context that handles action updates and queries
 */
export const ProvideAction = ({
  children,
}: ProvideActionProps): JSX.Element => {
  // Hack to force the update when the actions change because the state is outside the component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const [simpleMode, setSimpleMode] = useState<boolean>(
    window.localStorage.getItem("action-simple-mode") === "true"
  );

  const navigate = useNavigate();
  const { uiSocket, dccClients } = useSocket();

  /**
   * Clears an action
   */
  const clearAction = (uuid: Action["uuid"]) => {
    delete actions[uuid];
    forceUpdate();
  };

  const isActionFinished = (action: Action) => {
    return (
      [Status.COMPLETED, Status.ERROR, Status.INVALID].includes(
        action.status
      ) || !dccClients.find((e) => e.uuid === action.context_metadata.uuid)
    );
  };

  /**
   * Clean actions that are finished
   */
  const cleanActions = () => {
    // Filter actions that are finished
    Object.keys(actions)
      .filter((uuid) => isActionFinished(actions[uuid].action))
      .forEach((uuid) => {
        uiSocket.emit("clearAction", { uuid }, () => {
          delete actions[uuid];
        });
      });
    forceUpdate();
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
      navigate(`/action/${newAction.data.uuid}`);

      // Brings the dektop app on top
      runIfInElectron(() => window.electron.send("bringWindowToFront"));

      forceUpdate();
    },
    [navigate]
  );

  /**
   * Called when receiving updates on an action from the server
   */
  const onActionUpdate = useCallback<UIOnServerEvents["actionUpdate"]>(
    (actionDiff) => {
      const { uuid } = actionDiff.data;

      const previousStatus = actions[uuid].action.status;

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
      if (
        actions[uuid] &&
        actions[uuid].action &&
        !(previousStatus === Status.WAITING_FOR_RESPONSE)
      ) {
        // Sort the commands by status code
        const allCommands = Object.values(actions[uuid].action.steps)
          .map((s) => Object.values(s.commands))
          .flat();

        if (allCommands.length > 0) {
          const firstCommandWaitingForResponse = allCommands.find(
            (c) => c.status === Status.WAITING_FOR_RESPONSE && !c.hide
          );

          if (firstCommandWaitingForResponse) {
            const commandItem = document.getElementById(
              `cmd-${firstCommandWaitingForResponse.uuid}`
            );

            if (commandItem) {
              // Scroll to that specific command
              setTimeout(
                () =>
                  commandItem.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                  }),
                400
              );
            }
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
          }
        }
      });

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

      // Replace back the old action by the new one
      actions[uuid].oldAction = actions[uuid].action;

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

    uiSocket.on("dccDisconnect", onClientDisconnect);

    return () => {
      uiSocket.off("connect", onConnect);

      uiSocket.off("actionQuery", onActionQuery);
      uiSocket.off("actionUpdate", onActionUpdate);

      uiSocket.off("dccDisconnect", onClientDisconnect);
    };
  }, [onActionQuery, onActionUpdate, onClientDisconnect, onConnect, uiSocket]);

  return (
    <ActionContext.Provider
      value={{
        actions,
        clearAction,
        cleanActions,
        sendActionUpdate,
        isActionFinished,
        simpleMode,
        setSimpleMode,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = (): ActionContext => useContext(ActionContext);
