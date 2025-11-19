export function createRng(seed = Date.now()) {
  // Small fast LCG; deterministic per session
  let state = Number(seed) >>> 0 || 1;

  function next() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  }

  function int(min, max) {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function pick(array) {
    if (!array.length) return undefined;
    return array[int(0, array.length - 1)];
  }

  return { next, int, pick, seed };
}