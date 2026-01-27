import { useEffect, useRef } from "react";

export default function useAutoRefresh(callback, interval = 5000) {
  const isRunning = useRef(false);

  useEffect(() => {
    if (!callback) return;

    // initial load
    callback();

    const id = setInterval(() => {
      if (!isRunning.current) {
        isRunning.current = true;
        Promise.resolve(callback()).finally(() => {
          isRunning.current = false;
        });
      }
    }, interval);

    return () => clearInterval(id);
  }, []);
}
