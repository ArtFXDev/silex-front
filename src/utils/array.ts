/**
 * Get the last element of an array
 */
export function lastElementOf<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[array.length - 1];
}
