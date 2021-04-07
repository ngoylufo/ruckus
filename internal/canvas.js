import * as globals from "./globals.js";
import { memoize } from "./utils.js";

const getContext = (canvas) => {
  if (typeof canvas === "string") {
    return document.querySelector(canvas).getContext("2d");
  }
  return canvas.getContext("2d");
};

const createResizer = memoize(({ dimensions, trackMouse }) => {
  if (!dimensions && trackMouse) {
    return () => {
      const ctx = globals.get("ruckus.canvas.ctx");
      const rect = ctx.canvas.getBoundingClientRect();
      globals.merge("ruckus.canvas.rect", rect);
    };
  }

  return () => {
    const ctx = globals.get("ruckus.canvas.ctx");
    const rect = ctx.canvas.getBoundingClientRect();

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    globals.merge("ruckus.canvas.rect", rect);
  };
});

export const write = (ctx, text, { x, y, alpha, font, style }) => {
  ctx.globalAlpha = alpha ?? 1;
  ctx.font = font ?? '24px Arial';
  ctx.fillStyle = style ?? 'black';
  ctx.fillText(text, x ?? 0, y ?? 0);
};

export const init = ({ element, dimensions, trackMouse }) => {
  const ctx = globals.set("ruckus.canvas.ctx", getContext(element));
  const resize = createResizer({ dimensions, trackMouse });

  if (trackMouse) {
    const mouse = { x: 0, y: 0, width: 0.1, height: 0.1 };
    const rect = globals.merge("ruckus.canvas.rect", {});

    element.addEventListener("mousemove", (ev) => {
      mouse.x = ev.x - rect.left;
      mouse.y = ev.y - rect.top;
    });

    globals.set("ruckus.canvas.mouse", mouse);
  }

  if (dimensions) {
    Object.assign(element, dimensions);
  }

  window.addEventListener("resize", resize);
  window.dispatchEvent(new Event("resize"));
};
