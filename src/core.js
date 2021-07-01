import globals from "$tools/globals";
import * as canvas from "$modules/canvas";
import { noop, error } from "$tools/utils";

const defaultOptions = {};
const actions = { update: noop, render: noop };
const metrics = { frames: { rid: 0 }, timings: { acc: 0, delta: 0, last: 0 } };

const loop = () => {
	metrics.frames.rid = requestAnimationFrame(loop);
	globals.clear(globals.context, globals.options.fill);

	metrics.timings.now = performance.now();
	metrics.timings.delta = metrics.timings.now - metrics.timings.last;
	metrics.timings.acc += metrics.timings.delta;

	while (metrics.timings.acc >= metrics.timings.ms) {
		actions.update(metrics.timings.delta);
		metrics.timings.acc -= metrics.timings.delta;
	}

	actions.render(globals.context);
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
	if (!Object.keys(actions).includes(action)) {
		return error(`No action named ${action}!`);
	}

	if (typeof callback !== "function") {
		return error(
			`Action (${action}) callback must be of type 'function', '${typeof callback}' given.`
		);
	}

	actions[action] = callback;
};

export const start = () => {
	if (!globals.context) {
		return error("Canvas was not yet initialized!");
	}
	loop();
};

export const stop = () => {
	cancelAnimationFrame(metrics.frames.rid);
};
