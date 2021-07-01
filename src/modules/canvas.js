import globals from "$tools/globals";

const defaultOptions = {
	dimensions: null,
	text: {
		color: "#666",
		align: "start",
		font: "20px serif",
		baseline: "alphabetical"
	}
};

const getContext = (canvas) => {
	if (typeof canvas === "string") {
		return document.querySelector(canvas).getContext("2d");
	}
	return canvas.getContext("2d");
};

export const clear = (ctx) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const fill = (ctx, style) => {
	ctx.fillStyle = style;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const puts = (ctx, text, position, putsOptions = {}) => {
	putsOptions = Object.assign({}, defaultOptions.text, putsOptions);

	ctx.save();
	ctx.font = putsOptions.font;
	ctx.fillStyle = putsOptions.color;

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

export const addEventListener = (type, callback) => {
	globals.context.canvas.addEventListener(type, function (event) {
		callback(event, globals.context.canvas);
	});
};

export const initialize = (canvas, options = {}) => {
	const devicePixelRatio = window.devicePixelRatio ?? 1;
	options = Object.assign({}, defaultOptions, options);
	globals.context = getContext(canvas);

	const get_dimensions = (() => {
		if (options.dimensions) return () => options.dimensions;
		return () => globals.context.canvas.getBoundingClientRect();
	})();

	globals.canvasOptions = window.addEventListener("resize", function () {
		const dimensions = get_dimensions();
		globals.context.canvas.width = devicePixelRatio * dimensions.width;
		globals.context.canvas.height = devicePixelRatio * dimensions.height;

		if (options.dimensions) {
			globals.context.canvas.style.width = `${dimensions.width}px`;
			globals.context.canvas.style.height = `${dimensions.height}px`;
		}

		globals.context.scale(devicePixelRatio, devicePixelRatio);
	});

	window.dispatchEvent(new Event("resize"));
};
