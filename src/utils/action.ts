import { uiSocket } from "context/SocketContext";
import {
  Acknowledgement,
  LaunchActionParameters,
  LaunchSceneParameters,
  ServerResponse,
} from "types/socket";

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
