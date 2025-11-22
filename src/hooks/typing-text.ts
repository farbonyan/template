import * as React from "react";

export const useTypingText = (text: string, delay = 20) => {
  const [index, setIndex] = React.useState(0);
  const lastTimeRef = React.useRef(0);

  React.useEffect(() => {
    let frameId: number;
    let stopped = false;

    const tick = (time: number) => {
      if (stopped) return;
      if (time - lastTimeRef.current >= delay) {
        setIndex((prev) => {
          if (prev >= text.length) {
            stopped = true;
            return prev;
          }
          lastTimeRef.current = time;
          return prev + 1;
        });
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      setIndex(0);
    };
  }, [delay, text]);

  return text.slice(0, index);
};
