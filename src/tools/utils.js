export const noop = () => {};

export const error = (message) => console.error(message);

export const memoize = (callback, serializer = JSON.stringify) => {
	const cache = {};

	return (...args) => {
		const key = serializer(args);
		return cache[key] ?? (cache[key] = callback(...args));
	};
};

export const memoizeAsync = (asyncCallback, serializer = JSON.stringify) => {
	const memo = memoize(asyncCallback, serializer);
	return async (...args) => await memo(...args);
};
