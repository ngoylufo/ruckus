export const memoize = (callback, serialize = JSON.stringify) => {
  const cache = {};

  return (...args) => {
    const key = serialize(args);
    return cache[key] ?? (cache[key] = callback(...args));
  };
};

export const memoizeAsync = (callback, serialize = JSON.stringify) => {
  const memo = memoize(callback, serialize);
  return async (...args) => memo(...args);
};
