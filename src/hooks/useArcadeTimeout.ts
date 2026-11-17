import { useCallback, useEffect, useRef } from 'react';

// One feedback transition per game. Never let an old round run after exit/replay.
export function useArcadeTimeout() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelTransition = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const scheduleTransition = useCallback((callback: () => void, delay: number) => {
    cancelTransition();
    timer.current = setTimeout(() => {
      timer.current = null;
      callback();
    }, delay);
  }, [cancelTransition]);
  useEffect(() => cancelTransition, [cancelTransition]);
  return { scheduleTransition, cancelTransition };
}
