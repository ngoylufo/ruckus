export const compose = (...fns) => {
  return (x) => fns.reduceRight((arg, fn) => fn(arg), x);
};

export const partial = (fn, ...args) => fn.bind(null, ...args);

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
