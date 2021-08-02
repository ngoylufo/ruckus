import events from "$modules/events";
import canvas, { puts, cursor } from "$modules/canvas";
import { init, renderWith, updateWith, start, stop } from "./core";

export default {
	init,
	events,
	start,
	stop,
	renderWith,
	updateWith,
	canvas: {
		puts,
		cursor,
		addEventListener: canvas.addEventListener
	}
};
