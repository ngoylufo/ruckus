import fs from "fs";
import path from "path";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const external = (id) => id.startsWith("ruckus/");
const resolve = (...paths) => path.resolve(__dirname, ...paths);
const ext = (extname) => (name) => name.replace(/\.(j|t)s$/, extname);

const plugins = [
	commonjs(),
	typescript({ tsconfig: "./tsconfig.json" }),
	alias({
		entries: { $utils: resolve("src/utils"), $modules: resolve("src/modules") }
	})
];

export default [
	{
		input: "src/main.ts",
		output: [
			{
				format: "esm",
				file: "main.mjs",
				exports: "default",
				sourcemap: true
			},
			{
				format: "cjs",
				file: "main.js",
				exports: "default",
				sourcemap: true
			}
		],
		plugins,
		external
	},
	...fs
		.readdirSync("src/modules")
		.filter((file) => !file.includes("canvas.ts"))
		.map((file) => ({
			input: `src/modules/${file}`,
			output: [
				{
					format: "esm",
					exports: "auto",
					file: resolve("modules", ext(".mjs")(file)),
					sourcemap: true
				},
				{
					format: "cjs",
					exports: "auto",
					file: resolve("modules", ext(".js")(file)),
					sourcemap: true
				}
			],
			plugins,
			external
		}))
];
