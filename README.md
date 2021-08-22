# Ruckus Game Engine

A custom framework for making canvas based html5 games.

## Example usage

```js
import ruckus from "ruckus";
import events from "ruckus/events";
import square from "./objects/square";

ruckus.init("canvas#main", {
	time: { fps: 60 },
	canvas: {
		clear: true, // after every rendered frame.
		dimensions: { width: 800, height: 600 }
	}
});

ruckus.start((canvas, actions) => {
	const cursor = canvas.cursor(); // tracks mouse position on the canvas.

	events.on("ruckus:start", () => {
		console.log("started");
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
