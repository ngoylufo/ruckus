import { memoize } from "$tools/utils";

const state = { rect: null, cursor: {} };

const context = memoize(
	(element) => {
		if (typeof element === "string") {
			return document.querySelector(element).getContext("2d");
		}
		return element.getContext("2d");
	},
	() => undefined
);

const dimensions = (dimensions) => {
	if (dimensions === "viewport") {
		return { width: innerWidth, height: innerHeight };
	}
	if (dimensions?.width && dimensions?.height) {
		return dimensions;
	}
	return canvas.parentElement.getBoundingClientRect();
};

const add_resize_listener = (options) => {
	const ctx = context();
	const devicePixelRatio = window.devicePixelRatio ?? 1;

	window.addEventListener("resize", function () {
		const { width, height } = dimensions(options.dimensions);

		ctx.canvas.style.width = `${width}px`;
		ctx.canvas.style.height = `${height}px`;
		ctx.canvas.width = Math.floor(width * devicePixelRatio);
		ctx.canvas.height = Math.floor(height * devicePixelRatio);

		state.rect = ctx.canvas.getBoundingClientRect();
		ctx.scale(devicePixelRatio, devicePixelRatio);
	});

	setTimeout(() => {
		window.dispatchEvent(new Event("resize"));
	}, 100);
};

const add_mouse_listeners = (ctx) => {
	const ctx = context();

	ctx.canvas.addEventListener("mouseleave", () => {
		state.cursor.x = state.cursor.y = undefined;
	});

	ctx.canvas.addEventListener("mousemove", (event) => {
		state.cursor.x = event.x - state.rect.left;
		state.cursor.y = event.y - state.rect.top;
	});
};

export const clear = (ctx) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const fill = (ctx) => {
	ctx.fillStyle = state.fill;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const on = (event, callback) => {
	const { canvas } = context();
	canvas.addEventListener(event, callback);
};

export const cursor = memoize(
	() => {
		add_mouse_listeners();

		return {
			get x() {
				return state.cursor.x;
			},
			get y() {
				return state.cursor.y;
			}
		};
	},
	() => undefined
);

export const puts = (ctx, text, position, putsOptions = {}) => {
	ctx.save();
	ctx.font = putsOptions.font;
	ctx.fillStyle = putsOptions.colour;

	if (position === "center") {
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		position = [ctx.canvas.width / 2, ctx.canvas.height / 2];
	} else {
		ctx.textAlign = putsOptions.align;
		ctx.textBaseline = putsOptions.baseline;
	}

	ctx.fillText(text, position[0], position[1]);
	ctx.restore();
};

export const initialize = (element, options = {}) => {
	const ctx = context(element);
	options.fill && (state.fill = options.fill);
	add_resize_listener(ctx, options.dimensions);
	return ctx;
};
