import { uiSocket } from "context/SocketContext";
import { Action } from "types/action/action";
import { Status } from "types/action/status";
import {
  Acknowledgement,
  LaunchActionParameters,
  LaunchSceneParameters,
  ServerResponse,
} from "types/socket";

import { getStatusColor } from "./status";

/**
 * Returns the current mode based on the url
 */
export function getCurrentMode(): "prod" | "beta" | "dev" {
  const isDev = window.location.host.includes("localhost");
  const isProd = !window.location.host.includes("preprod");

  return isDev ? "dev" : isProd ? "prod" : "beta";
}

/**
 * Launches an action by emiting the message to the socket server
 */
export function launchAction(
  data: LaunchActionParameters,
  callback: Acknowledgement<ServerResponse>
): void {
  // We add the current mode for package resolving
  uiSocket.emit("launchAction", { ...data, mode: getCurrentMode() }, callback);
}

/**
 * Launches a scene with a DCC
 */
export function launchScene(
  data: LaunchSceneParameters,
  callback: Acknowledgement<ServerResponse>
): void {
  // We add the current mode for package resolving
  uiSocket.emit("launchScene", { ...data, mode: getCurrentMode() }, callback);
}

/**
 * Returns true if any of the steps of the action is waiting for user input
 */
export function someStepsAreWaitingForInput(action: Action): boolean {
  return Object.values(action.steps).some(
    (step) => step.status === Status.WAITING_FOR_RESPONSE
  );
}

export function getLastStepStatusColor(action: Action): string {
  return getStatusColor(
    Object.values(action.steps)
      .reverse()
      .find((a) => a.status !== Status.INITIALIZED)?.status
  );
}
