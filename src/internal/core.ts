import type {
	Context,
	RenderCallback,
	RuckusActions,
	RuckusOptions,
	RuckusState,
	StartCallback,
	UpdateCallback
} from "$utils/interface";

import events from "ruckus/events";
import * as canvas from "./canvas";
import { noop, override } from "$utils/utils";

const actions: RuckusActions = { clear: noop, render: noop, update: noop };

const state: RuckusState = {
	rid: 0,
	context: null,
	state: "idle",
	time: {
		fps: 0,
		now: 0,
		step: 0,
		last: 0,
		delta: 0,
		start: 0,
		interval: 0,
		accumulated: 0
	}
};

const updateWith = (callback: UpdateCallback): void => {
	actions.update = callback;
};

const renderWith = (callback: RenderCallback): void => {
	actions.render = callback;
};

const loop = (timestamp: number): void => {
	state.rid = requestAnimationFrame(loop);
	state.time.delta = timestamp - state.time.last;
	state.time.accumulated += state.time.delta;

	if (state.time.delta > state.time.interval) {
		state.time.last = timestamp - (state.time.delta % state.time.interval);
		events.emit("tick", state.time);

		while (state.time.accumulated >= state.time.interval) {
			actions.update(state.time);
			state.time.accumulated -= state.time.interval;
		}

		actions.clear(state.context as Context);
		actions.render(state.context as Context);
	}
};

const defaultOptions: RuckusOptions = {
	time: { fps: 60 },
	canvas: {
		dimensions: "container"
	}
};

export const init = (
	element: string,
	options: Partial<RuckusOptions> = {}
): void => {
	const time = override(defaultOptions.time, options.time ?? {});
	const canvasOptions = override(defaultOptions.canvas, options.canvas ?? {});

	state.time.fps = time.fps;
	state.time.step = 1 / state.time.fps;
	state.time.interval = 1000 / state.time.fps;

	state.context = canvas.init(element, canvasOptions);
};

export const start = (callback: StartCallback): void => {
	if (state.state !== "idle") {
		throw new Error("Ruckus.Start was already called");
	}

	state.time.last = performance.now();
	state.time.start = state.time.last;

	callback({ on: canvas.on }, { renderWith, updateWith });
	events.emit("start");
	resume(false);
};

export const pause = (): void => {
	events.emit((state.state = "paused"));
	cancelAnimationFrame(state.rid);
};

export const resume = (emit = true): void => {
	state.state = "running";
	if (emit) {
		events.emit("resumed");
	}
	loop(state.time.last);
};

export const stop = (): void => {
	events.emit((state.state = "stopped"));
	loop(state.time.last);
};
