import { useEffect, useRef } from "react";
import { theme } from "style/theme";
import { frameSetToSet } from "utils/frameset";

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

    context.fillStyle = theme.palette.success.main;
    context.globalAlpha = 1.0;

    const displayFrames = (frameSet: string | undefined, color: string) => {
      if (!frameSet || !totalFrames) return;

      const frameWidth = canvas.width / totalFrames;
      context.fillStyle = color;
      const frames = frameSetToSet(frameSet);

      frames.forEach((frame) => {
        frame = frame + frameIn;
        const x = frame * frameWidth;

        if (x <= canvas.width) {
          context.fillRect(x - 1, 0, frameWidth + 1, canvas.height);
        }
      });
    };

    displayFrames(frameSet, theme.palette.success.main);
    displayFrames(tempFrameSet, theme.palette.info.main);
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
