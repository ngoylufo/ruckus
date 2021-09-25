module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier"
	],
	rules: {
		"@typescript-eslint/no-non-null-assertion": "off"
	},
	plugins: ["@typescript-eslint"],
	ignorePatterns: ["*.mjs", "*.cjs", "*.js"],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"]
	}
};
