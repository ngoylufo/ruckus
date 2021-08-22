import events from "$modules/events";
import { on, puts, cursor } from "$modules/canvas";
import { init, renderWith, updateWith, start, stop } from "./core";

export default {
	init,
	events,
	start,
	stop,
	renderWith,
	updateWith,
	canvas: {
		on,
		puts,
		cursor
	}
};
