import ColorHash from "color-hash";

const colorHash = new ColorHash({ lightness: 0.7, saturation: 0.8 });

export function getColorFromString(str: string): string {
  return colorHash.hex(str);
}
