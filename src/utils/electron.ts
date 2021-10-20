import isElectron from "is-electron";

/**
 * Run the given function if running inside electron
 * @param func the function to run
 */
export const runIfInElectron = (func: () => void): void => {
  if (isElectron()) func();
};
