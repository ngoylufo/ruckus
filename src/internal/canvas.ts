import type {
	CanvasOptions,
	Context,
	Dimensions,
	FixedDimensions
} from "$utils/interface";

import { createCanvas } from "$utils/canvas";
import { memoize, override } from "$utils/utils";

const defaultOptions: CanvasOptions = {
	dimensions: "container"
};

const context = memoize(
	(target?: string | HTMLElement): Context => {
		if (!target) {
			throw new Error(`Invalid target for context: ${target}.`);
		}

		if (typeof target === "string") {
			const element = document.querySelector(target);
			if (element === null) {
				throw new Error(`Failed to get element from selector: ${target}.`);
			}
			return context(target);
		}

		if (!(target instanceof HTMLCanvasElement)) {
			const canvas = createCanvas(target);
			return context(canvas);
		}

		return target.getContext("2d") as Context;
	},
	() => "context"
);

const resize = () => {
	window.dispatchEvent(new Event("resize"));
};

const parse_dimensions = (
	ctx: Context,
	dimensions: Dimensions
): FixedDimensions => {
	if (dimensions === "viewport") {
		return { width: window.innerWidth, height: window.innerHeight };
	}

	if (dimensions === "container") {
		const container = ctx.canvas.parentElement;
		if (container === null) {
			throw new Error("Canvas does not have a parent container.");
		}
		return container.getBoundingClientRect();
	}

	return dimensions;
};

const updateOnResize = (ctx: Context, dimensions: Dimensions): void => {
	const devicePixelRatio = window.devicePixelRatio;

	window.addEventListener("resize", () => {
		const { width, height } = parse_dimensions(ctx, dimensions);

		ctx.canvas.style.width = `${width}px`;
		ctx.canvas.style.height = `${height}px`;
		ctx.canvas.width = Math.floor(width * devicePixelRatio);
		ctx.canvas.height = Math.floor(height * devicePixelRatio);

		ctx.scale(devicePixelRatio, devicePixelRatio);
	});

	resize();
};

export const on = (event: string, callback: EventListener): void => {
	const ctx = context();
	ctx.canvas.addEventListener(event, callback);
};

export const init = (
	element: string,
	options: Partial<CanvasOptions> = {}
): Context => {
	const ctx = context(element);
	const parsedOptions = override(defaultOptions, options);

	updateOnResize(ctx, parsedOptions.dimensions);

	return ctx;
};
