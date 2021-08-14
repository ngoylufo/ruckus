import { memoize } from "$tools/utils";

const state = { rect: null, cursor: { x: 0, y: 0 } };

const get_context = memoize(
	(canvas) => {
		if (typeof canvas === "string") {
			return document.querySelector(canvas).getContext("2d");
		}
		return canvas.getContext("2d");
	},
	() => {}
);

const get_dimensions = (canvas, dimensions) => {
	if (dimensions === "viewport") {
		return { width: innerWidth, height: innerHeight };
	}
	if (dimensions?.width && dimensions?.height) {
		return dimensions;
	}
	return canvas.parentElement.getBoundingClientRect();
};

const add_resize_listener = (context, dimensions) => {
	const devicePixelRatio = window.devicePixelRatio ?? 1;

	window.addEventListener("resize", () => {
		const { width, height } = get_dimensions(context.canvas, dimensions);

		context.canvas.style.width = `${width}px`;
		context.canvas.style.height = `${height}px`;
		context.canvas.width = Math.floor(width * devicePixelRatio);
		context.canvas.height = Math.floor(height * devicePixelRatio);

		state.rect = context.canvas.getBoundingClientRect();
		context.scale(devicePixelRatio, devicePixelRatio);
	});

	setTimeout(() => {
		window.dispatchEvent(new Event("resize"));
	}, 50);
};

const add_mouse_listener = (context) => {
	state.rect = context.canvas.getBoundingClientRect();

	context.canvas.addEventListener("mouseleave", () => {
		state.cursor.x = state.cursor.y = undefined;
	});

	context.canvas.addEventListener("mousemove", (event) => {
		state.cursor.x = event.x - state.rect.left;
		state.cursor.y = event.y - state.rect.top;
	});
};

const addEventListener = (type, callback) => {
	const { canvas } = get_context();
	canvas.addEventListener(type, function (event) {
		callback(event, canvas);
	});
};

const initialize = (element, options = {}) => {
	const context = get_context(element);
	options.fill && (state.fillStyle = options.fill);

	if (options.cursor) {
		add_mouse_listener(context);
	}

	add_resize_listener(context, options.dimensions);

	return (state.context = context);
};

export const cursor = memoize(() => state.cursor);

export const clear = (context) => {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const fill = (context) => {
	context.fillStyle = state.fillStyle;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
};

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

export default { initialize, addEventListener };
