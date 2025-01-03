import { canvas } from "./gameCanvas.js";
import { donutImages } from "./donut.js";
import { degToRad } from "./utils.js";

export const grid = 128;
export const bubbleGap = 1;
export const wallSize = 4;
export const bubbles = [];

// min/max angle (in radians) of the shooting arrow
export const minDeg = degToRad(-60);
export const maxDeg = degToRad(60);

export const curBubblePos = {
  //place the current bubble horizontally in middle of screen
  x: canvas.width * 0.5,
  y: canvas.height - grid * 1.5,
};
export const curBubble = {
  x: curBubblePos.x,
  y: curBubblePos.y,
  img: donutImages[0],
  radius: grid * 0.5, // a circles radius is half the width (diameter)

  //how fast the bubble should go in either the x or y direction
  speed: 32,

  // bubble velocity
  dx: 0,
  dy: 0,
};
