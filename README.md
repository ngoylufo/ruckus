# Ruckus Game Engine

A custom framework for making canvas based html5 canvas games.

## Example usage

```js
import ruckus from "ruckus";
import events from "ruckus/events";
import square from "./objects/square";

ruckus.init("canvas#main", {
	time: { fps: 60 },
	canvas: {
		clear: true, // before every rendered frame.
		dimensions: { width: 800, height: 600 }
	}
});

ruckus.start((canvas, actions) => {
	// tracks mouse position on the canvas.
	const cursor = canvas.cursor();

	events.on("ruckus:start", () => {
		console.log("started");
	});

	canvas.on("dblclick", () => {
		console.log("double clicked on canvas");
	});

	actions.updateWith((timings) => {
		square.update(timings.delta);
	});

	actions.renderWith((context) => {
		canvas.puts(context, "Hello, World", [cursor.x, cursor.y]);
		square.render(context);
	});
});
```
