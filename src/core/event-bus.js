export function createEventBus() {
  const listeners = new Map();

  function on(type, handler) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(handler);
    return () => off(type, handler);
  }

  function off(type, handler) {
    const set = listeners.get(type);
    if (!set) return;
    set.delete(handler);
    if (!set.size) listeners.delete(type);
  }

  function emit(type, payload) {
    const set = listeners.get(type);
    if (!set) return;
    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (err) {
        console.error("[event-bus] handler error", type, err);
      }
    }
  }

  return { on, off, emit };
}