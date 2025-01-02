// gameCanvas.js
export const canvas = document.getElementById("game_canvas");
export const context = canvas.getContext("2d");
canvas.width = 1040;
canvas.height = 1568;

// constants.js
export const grid = 128;
export const bubbleGap = 1;
export const wallSize = 4;
export const donutSize = 32;
export const minDeg = degToRad(-60);
export const maxDeg = degToRad(60);

// donutImages.js
export const donutImages = [
  "img/pink_donut.png",
  "img/white_donut.png",
  "img/chocolate_donut.png",
  "img/blue_donut.png",
].map((path) => {
  const img = new Image();
  img.src = path;
  return img;
});

// levels.js
export const levels = [
  [
    ["P", "P", "B", "B", "C", "C", "W", "W"],
    ["P", "P", "B", "B", "C", "C", "W"],
    ["C", "C", "W", "W", "P", "P", "B", "B"],
    ["C", "W", "W", "P", "P", "B", "B"],
  ],
];

// utils.js
export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function rotatePoint(x, y, angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDistance(obj1, obj2) {
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

export function collides(obj1, obj2) {
  return getDistance(obj1, obj2) < obj1.radius + obj2.radius;
}

// gameObjects.js
import { donutImages } from "./donutImages.js";
import { grid, wallSize } from "./constants.js";
import { levels } from "./modules/levels.js";

export const donutMap = {
  P: donutImages[0],
  W: donutImages[1],
  C: donutImages[2],
  B: donutImages[3],
};

export const bubbles = [];
export const particles = [];

export function createBubble(x, y, img) {
  const row = Math.floor(y / grid);
  const col = Math.floor(x / grid);

  const startX = row % 2 === 0 ? 0 : 0.5 * grid;
  const center = grid * 0.5;

  bubbles.push({
    x: wallSize + (grid + 1) * col + startX + center,
    y: wallSize + (grid - 4) * row + center,
    radius: grid / 2,
    img,
    active: Boolean(img),
  });
}

// Initialize level
levels[0].forEach((row, rowIndex) => {
  row.forEach((donut, colIndex) => {
    createBubble(colIndex * grid, rowIndex * grid, donutMap[donut]);
  });
});

// arrow.js
import { canvas, context } from "./gameCanvas.js";
import { minDeg, maxDeg, grid } from "./constants.js";

export const arrow = {
  shootDeg: 0,
  shootDir: 0,
};

export function drawArrow() {
  context.save();
  context.translate(canvas.width / 2, canvas.height - grid * 1.5);
  context.rotate(arrow.shootDeg);
  context.translate(0, -grid * 0.5 * 4.5);

  context.strokeStyle = "#87418c";
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, grid * 2);
  context.moveTo(0, 0);
  context.lineTo(-14, grid * 0.4);
  context.moveTo(0, 0);
  context.lineTo(14, grid * 0.4);
  context.stroke();

  context.restore();
}

export function updateArrow() {
  arrow.shootDeg += degToRad(2) * arrow.shootDir;
  if (arrow.shootDeg < minDeg) arrow.shootDeg = minDeg;
  if (arrow.shootDeg > maxDeg) arrow.shootDeg = maxDeg;
}

// loop.js
import { canvas, context } from "./gameCanvas.js";
import { drawArrow, updateArrow } from "./arrow.js";
import { bubbles, particles } from "./gameObjects.js";

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  updateArrow();
  drawArrow();

  // Draw bubbles
  bubbles.forEach((bubble) => {
    if (bubble.active) {
      context.drawImage(
        bubble.img,
        bubble.x - grid / 2,
        bubble.y - grid / 2,
        grid,
        grid
      );
    }
  });

  // Draw particles
  particles.forEach((particle) => {
    if (particle.active) {
      context.drawImage(
        particle.img,
        particle.x - grid / 2,
        particle.y - grid / 2,
        grid,
        grid
      );
    }
  });
}

requestAnimationFrame(loop);

// main.js
import "./loop.js";
import { canvas, context } from "./gameCanvas.js";
import { arrow } from "./arrow.js";

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") arrow.shootDir = -1;
  if (e.key === "ArrowRight") arrow.shootDir = 1;
});

document.addEventListener("keyup", (e) => {
  if (
    (e.key === "ArrowLeft" && arrow.shootDir === -1) ||
    (e.key === "ArrowRight" && arrow.shootDir === 1)
  ) {
    arrow.shootDir = 0;
  }
});
