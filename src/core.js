import { noop } from "$tools/utils";
import { initialize, on, puts, cursor, clear, fill } from "$modules/canvas";

import events from "ruckus/events";

const globals = { context: null };
const metrics = { frames: {}, timings: {} };
const actions = { clear: noop, render: noop, update: noop };

const looper = (timestamp) => {
	const { frames, timings } = metrics;

	frames.rid = requestAnimationFrame(looper);
	timings.delta = timestamp - timings.last;
	timings.acc += timings.delta;

	if (timings.delta > timings.interval) {
		timings.last = timestamp - (timings.delta % timings.interval);
		events.emit("ruckus:tick", timings);

		while (timings.acc >= timings.interval) {
			actions.update(timings);
			timings.acc -= timings.interval;
		}

		actions.clear(globals.context);
		actions.render(globals.context);
	}
};

const updateWith = (callback) => {
	actions.update = callback;
};

const renderWith = (callback) => {
	actions.render = callback;
};

export const init = (element, options = {}) => {
	metrics.frames.rid = metrics.frames.count = 0;
	metrics.timings.fps = options?.time?.fps ?? 60;
	metrics.timings.step = 1 / metrics.timings.fps;
	metrics.timings.interval = 1000 / metrics.timings.fps;

	events.once("ruckus:start", () => {
		metrics.timings.acc = 0;
		metrics.timings.last = performance.now();
		metrics.timings.start = metrics.timings.last;
	});

	actions.clear = (() => {
		if (options.canvas.clear) return clear;
		if (options.canvas.fill) return fill;
		return noop;
	})();

	globals.context = initialize(element, options.canvas);
};

export const start = (callback) => {
	callback && callback({ on, cursor, puts }, { renderWith, updateWith });
	events.emit("ruckus:start", metrics.timings);
	requestAnimationFrame(looper);
};

export const stop = () => {
	events.emit("ruckus:stop", metrics.timings);
	cancelAnimationFrame(metrics.frames.rid);
};
