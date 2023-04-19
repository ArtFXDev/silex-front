import { useCallback, useEffect, useRef, useState } from "react";

import { easeInQuint } from "~/utils/easings";

interface AnimatedNumberProps {
  on: boolean;
  duration: number;
  onCompletion?: () => void;
  range: { from: number; to: number };
}

const AnimatedNumber = ({
  on,
  duration,
  onCompletion,
  range,
}: AnimatedNumberProps): JSX.Element => {
  const [count, setCount] = useState(range.from);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback<FrameRequestCallback>(
    (time) => {
      if (previousTimeRef.current && startTimeRef.current) {
        const normTime =
          (previousTimeRef.current - startTimeRef.current) / duration;

        setCount(
          Math.round(
            easeInQuint(normTime) * (range.to - range.from) + range.from
          )
        );
      }

      // Store the current time
      previousTimeRef.current = time;
      if (!startTimeRef.current) startTimeRef.current = time;

      // Stop the animation when the duration is over
      if (requestRef.current && time - startTimeRef.current >= duration) {
        cancelAnimationFrame(requestRef.current);
        if (onCompletion) onCompletion();
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [duration, range.from, range.to]
  );

  useEffect(() => {
    if (on) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, on]);

  return <div>{count}</div>;
};

export default AnimatedNumber;
