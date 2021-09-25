export const createCanvas = (container: Element): HTMLCanvasElement => {
	const canvas = document.createElement("canvas");
	container.appendChild(canvas);
	return canvas;
};
