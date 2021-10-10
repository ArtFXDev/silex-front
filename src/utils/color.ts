import ColorHash from "color-hash";

const colorHash = new ColorHash({ lightness: 0.7, saturation: 0.8 });

/**
 * Converts a string into a hex formatted color
 * @param str string to convert from
 */
export function getColorFromString(str: string): string {
  return colorHash.hex(str);
}
