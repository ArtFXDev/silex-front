import { useEffect, useRef } from "react";
import { theme } from "style/theme";
import { parseFrameSet } from "utils/frameset";

interface ValidationTimelineProps {
  totalFrames?: number;
  frameIn: number;
  frameSet?: string;
  tempFrameSet?: string;
  width?: string | number;
  backgroundColor?: string;
  height?: number;
  noBorder?: boolean;
}

const ValidationTimeline = ({
  totalFrames,
  frameSet,
  tempFrameSet,
  width,
  height,
  frameIn,
  backgroundColor,
  noBorder,
}: ValidationTimelineProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cnvs = canvasRef.current;
    if (!cnvs) return;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context = cnvs.getContext("2d")!;
    const canvas = context.canvas;

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (!frameSet || !totalFrames) return;
    context.fillStyle = theme.palette.success.main;

    const displayFrames = (frameSet: string, color: string) => {
      const frameWidth = canvas.width / totalFrames;
      context.fillStyle = color;

      const patterns = parseFrameSet(frameSet);

      const drawRange = (start: number, end: number) => {
        const x = start * frameWidth;

        if (x <= canvas.width) {
          context.fillRect(
            x - 1,
            0,
            frameWidth * (end - start) + 1,
            canvas.height
          );
        }
      };

      for (const pattern of patterns) {
        if (pattern.type === "single") {
          drawRange(pattern.start, pattern.start);
        } else if (pattern.type === "range") {
          if (pattern.step) {
            for (let i = pattern.start; i < pattern.end; i += pattern.step) {
              drawRange(i, i);
            }
          } else {
            drawRange(pattern.start, pattern.end);
          }
        }
      }
    };

    displayFrames(frameSet, theme.palette.success.main);

    if (tempFrameSet) {
      displayFrames(tempFrameSet, theme.palette.info.main);
    }
  }, [backgroundColor, frameIn, frameSet, tempFrameSet, totalFrames]);

  return (
    <canvas
      ref={canvasRef}
      height={height || 20}
      style={{
        width: width || "auto",
        borderRadius: 5,
        border: noBorder ? "" : "1px solid rgba(110, 110, 110, 0.5)",
      }}
    />
  );
};

export default ValidationTimeline;
