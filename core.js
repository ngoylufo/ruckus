import { init } from "./internal/canvas.js";
import * as globals from "./internal/globals.js";

const ruckus = globals.set("ruckus", {
  initialized: false,
  options: { fps: 60 },
  callbacks: { update: [], render: [] },
  metrics: {
    frame: { rid: 0, count: 0, running: false },
    timings: { accumulator: 0, delta: 0 },
  },
});

const initialize = () => {
  init(ruckus.canvas);
};

const render = () => {
  const { timings, frame } = ruckus.metrics;

  frame.rid = requestAnimationFrame(render);

  timings.now = performance.now();
  timings.delta = timings.now - timings.last;
  timings.last = timings.now;

  if (timings.delta > 1e3) {
    return;
  }

  timings.accumulator += timings.delta;

  while (metrics.timings.accumulator >= metrics.timings.ms) {
    for (const callback of ruckus.callbacks.update) {
      callback(timings.delta);
    }
    timings.accumulator -= timings.delta;
  }

  for (const callback of ruckus.callbacks.render) {
    callback(ruckus.canvas.ctx);
  }
};

export const updateWith = (callback) => {
  ruckus.callbacks.update.push(callback);
};

export const renderWith = (callback) => {
  ruckus.callbacks.render.push(callback);
};

export const setup = ({ canvas, globals: vars }) => {
  const options = globals.get("ruckus.options");
  const [last, ms] = [performance.now(), 1e3 / options.fps];

  globals.set("globals", vars);
  globals.set("ruckus.canvas", canvas);
  globals.merge("ruckus.metrics.timings", { last, ms });
};

export const run = () => {
  const initialized = globals.get("ruckus.initialized");

  if (!initialized) {
    globals.set("ruckus.initialized", !initialized);
    initialize();
  }

  render();
};

export const stop = () => {
  cancelAnimationFrame(ruckus.metrics.frame.rid);
  metrics.frame.running = false;
};
