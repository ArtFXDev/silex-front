const FRANGE_PATTERN =
  /^(-?\d+(?:\.\d+)?)(?:-(-?\d+(?:\.\d+)?)(?:([:xy])(-?\d+(?:\.\d+)?))?)?$/;

/**
 * Parse a frameset and return a list of tokens for each match
 * For example: "1-50, 4-8x2" => [ ["1", "50"], ["4", "8", "x", "2"]]
 *
 * See: https://github.com/justinfx/fileseq/blob/master/src/fileseq/constants.py
 */
export function parseFrameSet(value: string): string[][] {
  const tokens = value.split(",").map((t) => t.trim());
  const matches = tokens.map((token) => token.match(FRANGE_PATTERN));

  const parts = matches
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => m.filter((e) => e !== undefined).slice(1));

  return parts;
}

export function isFrameSetValid(value: string): boolean {
  const tokens = value.split(",").map((t) => t.trim());
  return !tokens
    .map((token) => token.match(FRANGE_PATTERN))
    .some((v) => v === null);
}

/**
 * Convert a frame set to a list of frames
 */
export function frameSetToList(pattern: string[]): number[] {
  const frames = [];

  if (pattern.length === 1) {
    frames.push(parseInt(pattern[0]));
  } else if (
    pattern.length === 2 ||
    (pattern.length === 4 && pattern[2] === "x")
  ) {
    const start = parseInt(pattern[0]);
    const end = parseInt(pattern[1]);
    const step = pattern.length === 4 ? parseInt(pattern[3]) : 1;

    for (let i = start; i < end; i += step) {
      frames.push(i);
    }
  }

  return frames;
}

/**
 * Convert a frameSet expression to a Set of numbers
 * Ex: "1-5, 3-7, 10-14x2" -> Set(1, 2, 3, 4, 5, 6, 7, 10, 12, 14)
 */
export function frameSetToSet(value: string): Set<number> {
  const tokens = parseFrameSet(value);
  const frames = new Set<number>();

  for (const token of tokens) {
    frameSetToList(token).forEach(frames.add, frames);
  }

  return frames;
}
