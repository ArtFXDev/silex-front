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
