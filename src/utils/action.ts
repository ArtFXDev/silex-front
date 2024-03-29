import { Action, ActionContext } from "~/types/action/action";
import { Status } from "~/types/action/status";

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

export function formatContextToString(ctx: ActionContext): string | undefined {
  const inContextValues = [
    ctx.project,
    ctx.asset,
    ctx.sequence,
    ctx.shot,
    ctx.task_type,
    ctx.task,
  ].filter((v) => v);

  return inContextValues.length > 0 ? inContextValues.join("  /  ") : undefined;
}

/**
 * Used to group calls to a certain function when for example modifying an input in the interface
 * See: https://www.freecodecamp.org/news/javascript-debounce-example/
 */
export function debounce<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeout: number
): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
