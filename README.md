# Ruckus Game Engine

A custom framework for making canvas based html5 games.

## Example usage

```js
import ruckus from "ruckus";
import square from "./objects/square";

let cursor;

ruckus.init("canvas#main", {
	time: { fps: 60 },
	canvas: {
		clear: true, // after every rendered frame.
		cursor: true, // track mouse position on the canvas
		dimensions: { width: 800, height: 600 }
	}
});

ruckus.events.once("ruckus:start", function () {
	// cursor only available after ruckus.init() is called.
	cursor = ruckus.canvas.cursor();
});

ruckus.events.on("ruckus:tick", function (timings) {
	console.log(timings);
});

ruckus.updateWith(function (timings) {
	square.update(timings.delta);
});

ruckus.renderWith(function (context) {
	ruckus.canvas.puts(context, "Hello, World", [cursor.x, cursor.y]);
	square.render(context);
});

ruckus.start();
```
