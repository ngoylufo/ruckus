import path from "path";
import alias from "@rollup/plugin-alias";
import analyze from "rollup-plugin-analyzer";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

const production = !process.env.ROLLUP_WATCH;
const resolve = (...paths) => path.resolve(__dirname, ...paths);

export default {
	input: "src/main.js",
	output: [
		{
			format: "es",
			name: "ruckus",
			sourcemap: true,
			file: resolve("dist", "ruckus.js"),
		},
		{
			format: "umd",
			name: "ruckus",
			sourcemap: true,
			file: resolve("dist", "ruckus.min.js"),
			plugins: [production && terser()]
		}
	],
	plugins: [
		alias({
			entries: {
				$tools: resolve("src/tools"),
				$modules: resolve("src/modules")
			}
		}),
		commonjs(),
		analyze({ summaryOnly: true })
	],
	watch: {
		clearScreen: false
	}
};
