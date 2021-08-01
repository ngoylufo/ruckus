import globals from "$tools/globals";
import events from "$modules/events";
import * as canvas from "$modules/canvas";
import { noop, error } from "$tools/utils";

const defaultOptions = {};
const metrics = { frames: { rid: 0 }, timings: { acc: 0, delta: 0, last: 0 } };

const loop = () => {
	metrics.frames.rid = requestAnimationFrame(loop);
	globals.clear(globals.context, globals.options.fill);

	metrics.timings.now = performance.now();
	metrics.timings.delta = metrics.timings.now - metrics.timings.last;
	metrics.timings.acc += metrics.timings.delta;
	metrics.timings.last = metrics.timings.now;

	events.emit("ruckus:tick");

	while (metrics.timings.acc >= metrics.timings.ms) {
		events.emit("ruckus:update", metrics);
		metrics.timings.acc -= metrics.timings.delta;
	}

	events.emit("ruckus:render", globals.context);
};

export const init = (reference, configurations = {}) => {
	globals.options = { ...defaultOptions, ...configurations };

	globals.clear = (() => {
		if (configurations.clear && !configurations.fill) return canvas.clear;
		if (configurations.fill) return canvas.fill;
		return noop;
	})();

	canvas.initialize(reference, globals.options);
};

export const on = (action, callback) => {
	if (!["tick", "update", "render"].includes(action)) {
		return error(`No action named ${action}!`);
	}

	const name = `ruckus:${action}`;
	events.off(name, globals[name]);
	events.on(name, (globals[name] = callback));
};

export const start = () => {
	if (!globals.context) {
		return error("Canvas was not yet initialized!");
	}
	events.emit("ruckus:start");
	loop();
};

export const stop = () => {
	cancelAnimationFrame(metrics.frames.rid);
	events.emit("ruckus:stop", metrics);
};
