import type { Noop } from "./interface";

interface Callback {
	(...args: never[]): unknown;
}

interface Serializer<P> {
	(args: P): string;
}

export const noop: Noop = () => undefined;

export const override = <T>(template: T, overrides: Partial<T>): T => {
	return { ...template, ...overrides };
};

export const memoize = <T extends Callback>(
	callback: T,
	serializer: Serializer<Parameters<T>> = JSON.stringify
): T => {
	const cache: { [x: string]: unknown } = {};

	return function (...args: Parameters<T>) {
		const key = serializer(args);
		return cache[key] ?? (cache[key] = callback(...args));
	} as unknown as T;
};
