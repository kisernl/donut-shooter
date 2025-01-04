import {
  grid,
  bubbles,
  wallSize,
  bubbleGap,
  curBubble,
  curBubblePos,
} from "./constants.js";
import {
  collides,
  getDistance,
  rotatePoint,
  degToRad,
  getRandomInt,
} from "./utils.js";
import { donuts } from "./donut.js";
import { dropFloatingDonuts } from "./gamePlay.js";

// find closest bubble that collides with object
export function getClosestBubble(obj, activeState = false) {
  const closestBubbles = bubbles.filter(
    (bubble) => bubble.active == activeState && collides(obj, bubble)
  );

  if (!closestBubbles.length) {
    return;
  }

  return (
    closestBubbles
      // turn array of bubbles into array of distances
      .map((bubble) => {
        return {
          distance: getDistance(obj, bubble),
          bubble,
        };
      })
      .sort((a, b) => a.distance - b.distance)[0].bubble
  );
}

// Update `createBubble` to correctly draw the image
export function createBubble(x, y, img) {
  const row = Math.floor(y / grid);
  const col = Math.floor(x / grid);

  const startX = row % 2 === 0 ? 0 : 0.5 * grid;
  const center = grid * 0.5;

  bubbles.push({
    x: wallSize + (grid + bubbleGap) * col + startX + center,
    y: wallSize + (grid + bubbleGap - 4) * row + center,
    radius: grid / 2,
    img: img, // Use the donut image
    active: img ? true : false,
  });
}

// get all bubbles that touch the passed in bubble
export function getNeighbors(bubble) {
  const neighbors = [];

  // check each of the 6 directions by "moving" the bubble by a full
  // grid in each of the 6 directions (60 degree intervals)
  const dirs = [
    // right
    rotatePoint(grid, 0, 0),
    // up-right
    rotatePoint(grid, 0, degToRad(60)),
    // up-left
    rotatePoint(grid, 0, degToRad(120)),
    // left
    rotatePoint(grid, 0, degToRad(180)),
    // down-left
    rotatePoint(grid, 0, degToRad(240)),
    // down-right
    rotatePoint(grid, 0, degToRad(300)),
  ];

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];

    const newBubble = {
      x: bubble.x + dir.x,
      y: bubble.y + dir.y,
      radius: bubble.radius,
    };
    const neighbor = getClosestBubble(newBubble, true);
    if (neighbor && neighbor !== bubble && !neighbors.includes(neighbor)) {
      neighbors.push(neighbor);
    }
  }
  return neighbors;
}

// remove bubbles that create a match of 3 images
export function removeMatch(targetBubble) {
  const matches = [targetBubble];

  bubbles.forEach((bubble) => (bubble.processed = false));
  targetBubble.processed = true;

  //loop over neighbors of matching images for more matches
  let neighbors = getNeighbors(targetBubble);
  for (let i = 0; i < neighbors.length; i++) {
    let neighbor = neighbors[i];

    if (!neighbor.processed) {
      neighbor.processed = true;

      if (neighbor.img === targetBubble.img) {
        matches.push(neighbor);
        neighbors = neighbors.concat(getNeighbors(neighbor));
      }
    }
  }

  if (matches.length >= 3) {
    matches.forEach((bubble) => {
      bubble.active = false;
    });
  }
}

// reset the bubble to shoot to the bottom of screen
export function getNewBubble() {
  curBubble.x = curBubblePos.x;
  curBubble.y = curBubblePos.y;
  curBubble.dx = curBubble.dy = 0;

  const randInt = getRandomInt(onabort, donuts.length - 1);
  curBubble.img = donuts[randInt];
}

// handle collision between current bubble and another bubble
export function handleCollision(bubble) {
  bubble.img = curBubble.img;
  bubble.active = true;
  getNewBubble();
  removeMatch(bubble);
  dropFloatingDonuts();
}

//
// export function checkWinCondition() {
//   const remainingDonuts = bubbles.filter(
//     (bubble) => bubble.active && bubble !== curBubble
//   );
//   if (remainingDonuts.length === 0) {
//     displayWinMessage();
//   }
// }

export function checkWinCondition() {
  const remainingDonuts = bubbles.filter(
    (bubble) => bubble.active && bubble !== curBubble
  );
  if (remainingDonuts.length === 0) return true;
}

export function levelReset() {
  curBubble.dx = 0;
  curBubble.dy = 0;
}
