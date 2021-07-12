const events = {};

export const register = (name) => {
	if (typeof name !== "string") {
		const error = `name is expected to be a string, ${typeof name} given`;
		return console.error(error);
	}
	events[name.trim()] = [];
};

export const on = (name, action) => {
	if (typeof action !== "function") {
		const error = `Event callback expects a function, "${typeof action}" given.`;
		return console.error(error);
	}

	if (!events.hasOwnProperty(name)) {
		register(name);
	}

	events[name] = [...events[name], action];
};

export const off = (name, action) => {
	if (!events.hasOwnProperty(name)) return;

	if (action) {
		const index = events[name].indexOf(action);
		if (index > -1) events[name].splice(index, 1);
		return;
	}

	events[name] = [];
};

export const trigger = (name, ...args) => {
	if (!events.hasOwnProperty(name)) return;
	events[name].forEach((callback) => callback(...args));
};
