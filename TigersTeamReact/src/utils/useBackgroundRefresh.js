import { useEffect, useRef } from 'react';
import { watchBackgroundRefresh } from './backgroundRefresh.mjs';

// Re-read data on server-push events without remounting tables or dialogs.
export default function useBackgroundRefresh(refresh, enabled = true) {
  const latest = useRef(refresh);
  latest.current = refresh;

  useEffect(() => {
    if (!enabled) return undefined;
    return watchBackgroundRefresh(() => latest.current(), window, document);
  }, [enabled]);
}
