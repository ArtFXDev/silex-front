/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Taken from https://stackoverflow.com/questions/25456013/javascript-deepequal-comparison/25456134
 */
function deepEqual(x: any, y: any): boolean {
  if (
    typeof x === "object" &&
    x !== null &&
    typeof y === "object" &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (const prop in x) {
      if (Object.prototype.hasOwnProperty.call(y, prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else if (x === y) {
    return true;
  } else return false;
}

function isObject(o: unknown): boolean {
  return typeof o === "object" && !Array.isArray(o) && o !== null;
}

/**
 * Diffs two objects, only return the keys that were modified
 */
export function diff(a: any, b: any): any {
  const result: any = {};

  Object.keys(a).forEach((keyA) => {
    if (typeof b[keyA] !== "undefined") {
      if (!deepEqual(b[keyA], a[keyA])) {
        if (isObject(b[keyA])) {
          result[keyA] = diff(a[keyA], b[keyA]);
        } else {
          result[keyA] = b[keyA];
        }
      }
    }
  });

  return result;
}
