# Ruckus Game Engine

A custom framework for making canvas based html5 games.

## Ruckus States

|               | Uninitialized | Initialized | Started | Looping | Paused | Loading | Stopped |
| ------------- | ------------- | ----------- | ------- | ------- | ------ | ------- | ------- |
| Uninitialized |               | init        |         |         |        |         |         |
| Initialized   |               | init        | start   |         |        |         |         |
| Started       |               |             | start   | loop    |        | load    | stop    |
| Looping       |               |             |         | loop    | pause  | load    | stop    |
| Paused        |               |             |         |         | pause  | load    | stop    |
| Loading       |               |             |         |         |        | load    | stop    |
| Stopped       |               |             |         |         |        |         |         |

```ts
import events from "ruckus/events";
import assets from "ruckus/assets";

type Sprite = {
	image: HTMLImageElement;
	dimensions: { width: number; height: number };
};

type AnimatedSprite = Sprite & {
	state: { frame: number; row: number };
};

export const create_sprite = () => {};

export class Sprite {
	private image: HTMLImageElement;

	constructor() {}
}
```

## Example usage

```ts
type Dimensions = "parent" | "viewport" | { width: number; height: number };

const dimensions = (
	canvas: HTMLCanvasElement,
	specified: Dimensions
): Dimensions => {
	if (typeof specified === "string") {
		if (specified === "viewport") {
			return { width: window.innerWidth, height: window.innerHeight };
		}
		return canvas.parentElement.getBoundingClientRect();
	}
	return specified;
};

function override<T>(template: T, overrides: Partial<T>): T {
	return {...template, ...overrides};
}

interface RenderCallback {
	(context: Context, meta?: Meta) => void
}
```

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

```js
import ruckus from "ruckus";

const app = ruckus.Instance();
```

```js
const state = { rid: 0, running: false };



const start = () => {
	loop();
}

const stop = () => {
	cancelAnimationFrame(state.rid);
}

rid = window.requestAnimationFrame(loop(timestamp: number = 0) => {
	rid = window.requestAnimationFrame(loop);

	// updates

	// renders
});
```

```js
import { Core } from "ruckus";

type Timings = {
	now: now
};

type Metrics = {
	timings: Timings
};

app.ports.render(function (ctx, meta) {});

app.ports.update(function (time: Readonly<Timing>) {});
```

```ts
import ruckus from "ruckus";

ruckus.setContextGetter(context2dGetter);

ruckus.setUpdateCallback(function (time) {});

ruckus.setRenderCallback(function (context) {});

ruckus.start((core) => {
	core.renderer;
});
```
