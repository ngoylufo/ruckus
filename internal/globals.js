const globals = {};

const shouldExtend = (reference, key) =>
  Array.isArray(reference[key]) ||
  !(typeof reference[key] === "object" && reference.hasOwnProperty(key));

export const set = (key, value) => {
  const path = key.split(".").map((s) => s.trim());
  const last = path[path.length - 1];
  let reference = globals;

  if (last === 'globals') {
    return Object.assign(reference, value);
  }

  while (path.length > 1) {
    const key = path.shift();
    if (shouldExtend(reference, key)) {
      reference[key] = {};
    }
    reference = reference[key];
  }

  return (reference[last] = value);
};

export const merge = (key, value) => {
  const defaultValue = Array.isArray(value) ? [] : {};
  const stored = get(key) ?? defaultValue;

  if (Array.isArray(value)) {
    for (const element of value) stored.push(element);
  } else if (typeof value === "object") {
    Object.assign(stored, value);
  }

  return stored;
};

export const get = (key) => {
  const path = key.split(".").map((s) => s.trim());
  let reference = globals;

  while (path.length && reference) {
    reference = reference[path.shift()];
  }

  return reference;
};
