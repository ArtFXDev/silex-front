/**
 * Returns a capitalized version of a string
 * @param str
 */
export function capitalize(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

export function fuzzyMatch(input: string, search: string): boolean {
  return input.toLowerCase().includes(search.toLowerCase());
}

/**
 * Converts a number of bytes into human readable size
 * Taken from: https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
 */
export function humanFileSize(size: number): string {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    Number((size / Math.pow(1024, i)).toFixed(2)) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

export function formatUnderScoreStringWithSpaces(str: string): string {
  return capitalize(str.replaceAll("_", " "));
}
