/**
 * Returns a capitalized version of a string
 * @param str
 */
export function capitalize(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Fuzzy matches a string or a list of strings with a search string
 * This function just tests if the search string is contained within the inputs
 */
export function fuzzyMatch(
  input: string | string[],
  search: string | undefined
): boolean {
  if (!search) return true;
  return (Array.isArray(input) ? input : [input]).some((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );
}

/**
 * Converts a number of bytes into human readable size
 * Taken from: https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
 */
export function humanFileSize(size: number): string {
  if (size === 0) return "0 B";
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
