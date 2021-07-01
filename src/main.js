import globals from "$tools/globals";
import { error } from "$tools/utils";
import * as canvas from "$modules/canvas";

export { init, on, start, stop } from "./core";

export const addEventListener = (type, callback) => {
	if (!globals.context) return error("Canvas was not yet initialized!");
	canvas.addEventListener(type, callback);
};

export const puts = (text, position, putsOptions = {}) => {
	if (!globals.context) return error("Canvas was not yet initialized!");
	canvas.puts(globals.context, text, position, putsOptions);
};
