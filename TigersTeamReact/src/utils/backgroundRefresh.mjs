// One server-push connection per browser tab, shared by every mounted subscriber.
const connections = new WeakMap();

function subscribe(browserWindow, listener) {
  let entry = connections.get(browserWindow);
  if (!entry) {
    const source = new browserWindow.EventSource('/api/updates');
    const listeners = new Set();
    entry = { source, listeners };
    const notify = () => [...listeners].forEach((callback) => callback());
    source.addEventListener('ready', notify);
    source.addEventListener('change', notify);
    connections.set(browserWindow, entry);
  }
  entry.listeners.add(listener);
  return () => {
    entry.listeners.delete(listener);
    if (entry.listeners.size === 0) {
      entry.source.close();
      connections.delete(browserWindow);
    }
  };
}

export function watchBackgroundRefresh(
  refresh,
  browserWindow,
  browserDocument,
) {
  let running = false;
  let disposed = false;
  let pending = false;
  const update = async () => {
    if (disposed) return;
    pending = true;
    if (running || browserDocument.visibilityState === 'hidden') return;
    running = true;
    try {
      while (
        pending &&
        !disposed &&
        browserDocument.visibilityState !== 'hidden'
      ) {
        pending = false;
        try {
          await refresh();
        } catch {
          // Keep the last successful data; reconnect/focus will retry.
        }
      }
    } finally {
      running = false;
    }
  };
  const unsubscribe = subscribe(browserWindow, update);
  browserWindow.addEventListener('focus', update);
  browserWindow.addEventListener('online', update);
  browserDocument.addEventListener('visibilitychange', update);
  return () => {
    disposed = true;
    unsubscribe();
    browserWindow.removeEventListener('focus', update);
    browserWindow.removeEventListener('online', update);
    browserDocument.removeEventListener('visibilitychange', update);
  };
}
