const FRANGE_PATTERN =
  /^(-?\d+(?:\.\d+)?)(?:-(-?\d+(?:\.\d+)?)(?:([:xy])(-?\d+(?:\.\d+)?))?)?$/;

type SingleFramePattern = { start: number; type: "single" };
type FrameRangePattern = {
  start: number;
  end: number;
  step?: number;
  type: "range";
};

type FrameSetPattern = SingleFramePattern | FrameRangePattern;

/**
 * Parse a frameset and return either a single frame or frame range for each match
 * See: https://github.com/justinfx/fileseq/blob/master/src/fileseq/constants.py
 */
export function parseFrameSet(value: string): FrameSetPattern[] {
  const tokens = value.split(",").map((t) => t.trim());
  const matches = tokens.map((token) => token.match(FRANGE_PATTERN));

  const parts: FrameSetPattern[] = matches
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => m.filter((e) => e !== undefined).slice(1))
    .map((tokens) => {
      switch (tokens.length) {
        case 1:
          return { type: "single", start: parseInt(tokens[0]) };
        case 2:
          return {
            type: "range",
            start: parseInt(tokens[0]),
            end: parseInt(tokens[1]),
          };
        case 4:
          return {
            type: "range",
            start: parseInt(tokens[0]),
            end: parseInt(tokens[1]),
            step: parseInt(tokens[3]),
          };
        default:
          return { type: "single", start: 0 };
      }
    });

  return parts;
}

export function isFrameSetValid(value: string): boolean {
  const tokens = value.split(",").map((t) => t.trim());
  const match = tokens.map((token) => token.match(FRANGE_PATTERN));
  return !match.some((v) => v === null);
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
