/**
 * This is the event listener.
 * @callback Listener
 * @param {any?} data The data passed to the listener.
 * @returns {void} Void
 */

/**
 * The set of all listeners for a particular event.
 * @typedef {Set<Listener>} Listeners
 */

/**
 * The collection of all events and their respective listeners.
 * @typedef {Map<String, Listeners>} Events
 */

/**
 * Returns the set of all listeners for a particular event.
 * @param {Events} events The collection of all events.
 * @param {String} event The name of the event.
 */
const getEventListeners = (events, event) => {
	if (!events.has(event)) events.set(event, new Set());
	return events.get(event);
};

/**
 * Adds a new listener for the given event.
 * @param {string} event - The name of the event to listen to.
 * @param {Listener} listener - A unary function.
 */
const on = (event, listener) => {
	const listeners = getEventListeners(events, event);
	if (typeof listener !== "function") {
		throw TypeError(`Listener for ${event} is not a function!`);
	}
	listeners.add(listener);
};

/**
 * Removes the given listener for the given event. If a listener is
 * not provided it clears all listeners for that event.
 * @param {string} event - The name of the event to clear.
 * @param {Listener?} listener - The listener to remove.
 */
const off = (event, listener) => {
	const listeners = getEventListeners(events, event);
	if (!listener) {
		return listeners.clear();
	}
	listeners.delete(listener);
};

/**
 * Adds a new listener, that is only called once, to the given event.
 * @param {string} event - The name of the event to listen to.
 * @param {Listener} listener - A unary function.
 */
const once = (event, listener) => {
	const cb = (data) => (off(event, cb), listener(data));
	on(event, cb);
};

/**
 * Emits a named event.
 * @param {string} event - The name of the event to emit/trigger.
 * @param {any} data - The data passed on to the event's listeners.
 */
const emit = async (event, data) => {
	const listeners = getEventListeners(events, event);
	listeners.forEach((listener) => listener(data));
};

export default { on, off, once, emit };
