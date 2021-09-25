interface EventEmitter {
	on(type: string, listener: Listener): void;
	off(type: string, listener?: Listener): void;
	once(type: string, listener: Listener): void;
	emit<T>(type: string, data?: T): void;
}

/**
 * A function that takes some data and does something with it.
 */
interface Listener {
	(data: unknown): void;
}

/**
 * The collection of all events and their respective listeners.
 */
type Events = Map<string, Set<Listener>>;

const events: Events = new Map();

/**
 * Returns the set of all listeners for a particular event.
 */
const getEventListeners = (event: string) => {
	if (!events.has(event)) events.set(event, new Set());
	return events.get(event) as Set<Listener>;
};

/**
 * Adds a new listener for the given event.
 */
const on = (event: string, listener: Listener): void => {
	const listeners = getEventListeners(event);
	if (typeof listener !== "function") {
		throw TypeError(`Listener for ${event} is not a function!`);
	}
	listeners.add(listener);
};

/**
 * Removes the given listener for the given event. If a listener is
 * not provided it clears all listeners for that event.
 */
const off = (event: string, listener?: Listener): void => {
	const listeners = getEventListeners(event);
	if (!listener) {
		return listeners.clear();
	}
	listeners.delete(listener);
};

/**
 * Adds a new listener, that is only called once, to the given event.
 */
const once = (event: string, listener: Listener): void => {
	const callback = (data: unknown) => (off(event, callback), listener(data));
	on(event, callback);
};

/**
 * Emits a named event.
 */
const emit = async <T>(event: string, data?: T): Promise<void> => {
	const listeners = getEventListeners(event);
	listeners.forEach((listener) => listener(data));
};

export default { on, off, once, emit } as EventEmitter;
