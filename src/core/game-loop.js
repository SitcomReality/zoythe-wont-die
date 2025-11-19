export function createGameLoop({ tick }) {
  let running = false;
  let frameId = null;

  function frame(ts) {
    if (!running) return;
    tick(ts);
    frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    frameId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (frameId != null) cancelAnimationFrame(frameId);
    frameId = null;
  }

  return { start, stop };
}

