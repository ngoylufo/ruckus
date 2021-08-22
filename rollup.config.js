import fs from "fs";
import path from "path";
import alias from "@rollup/plugin-alias";
import analyze from "rollup-plugin-analyzer";
import commonjs from "@rollup/plugin-commonjs";

const external = (id) => id.startsWith("ruckus/");
const resolve = (...paths) => path.resolve(__dirname, ...paths);
const ext = (extname) => (name) => name.replace(/\.js$/, extname);

const plugins = [
	alias({
		entries: {
			$tools: resolve("src/tools"),
			$modules: resolve("src/modules")
		}
	}),
	commonjs(),
	analyze({ summaryOnly: true })
];

export default [
	{
		input: "src/main.js",
		output: [
			{
				format: "esm",
				file: "main.mjs",
				exports: "default"
			},
			{
				format: "cjs",
				file: "main.js",
				exports: "default"
			}
		],
		plugins,
		external
	},
	...fs
		.readdirSync("src/modules")
		.filter((file) => !file.includes("canvas.js"))
		.map((file) => ({
			input: `src/modules/${file}`,
			output: [
				{
					format: "esm",
					exports: "auto",
					file: resolve("modules", ext(".mjs")(file))
				},
				{
					format: "cjs",
					exports: "auto",
					file: resolve("modules", ext(".js")(file))
				}
			],
			plugins,
			external
		}))
];
