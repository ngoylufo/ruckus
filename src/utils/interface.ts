export type Context = CanvasRenderingContext2D;

export interface FixedDimensions {
	width: number;
	height: number;
}

export type Dimensions = "viewport" | "container" | FixedDimensions;

export interface Noop {
	(...args: never[]): void;
	(): void;
}

export interface ClearCallback extends Noop {
	(ctx: Context): void;
}

export interface UpdateCallback extends Noop {
	(time: Readonly<Time>): void;
}

export interface RenderCallback extends Noop {
	(ctx: Context): void;
}

export interface CanvasOptions {
	dimensions: Dimensions;
}

export interface AddCanvasListener {
	(event: string, callback: EventListener): void;
}

export interface CanvasUtils {
	on: AddCanvasListener;
}

export interface RuckusOptions {
	time: {
		fps: number;
	};
	canvas: CanvasOptions;
}

export interface RuckusActions {
	clear: ClearCallback;
	update: UpdateCallback;
	render: RenderCallback;
}

export interface SetRuckusActions {
	updateWith(callback: UpdateCallback): void;
	renderWith(callback: RenderCallback): void;
}

export interface StartCallback {
	(utils: CanvasUtils, action: SetRuckusActions): void;
}

export interface Time {
	fps: number;
	now: number;
	step: number;
	last: number;
	delta: number;
	start: number;
	interval: number;
	accumulated: number;
}

type CurrentState = "idle" | "paused" | "running" | "stopped";

export interface RuckusState {
	time: Time;
	rid: number;
	state: CurrentState;
	context: Context | null;
}
