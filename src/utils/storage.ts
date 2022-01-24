/**
 * Used to store a dictionnary of elements in the browser local storage
 * This is used to store the list of recent tasks and opened scenes
 * @param key
 * @param id
 * @param element
 * @param limit
 */
export function addElementToLocalStorageQueue<T extends { lastAccess: number }>(
  key: string,
  id: string,
  element: T,
  limit: number
): void {
  const storedQueue = window.localStorage.getItem(key);

  let queue: { [id: string]: T } = {};

  if (storedQueue) {
    queue = JSON.parse(storedQueue);
    const queueSize = Object.keys(queue).length;

    // Limit the number of recent tasks
    if (queueSize >= limit) {
      const sortedKeys = Object.keys(queue).sort(
        (a, b) => queue[b].lastAccess - queue[a].lastAccess
      );

      // Remove the last one
      delete queue[sortedKeys[sortedKeys.length - 1]];
    }
  }

  // Add the element
  queue[id] = element;

  // Save it to local storage
  window.localStorage.setItem(key, JSON.stringify(queue));
}
