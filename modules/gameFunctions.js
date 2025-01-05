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
import { donuts, spriteProperties } from "./donut.js";
import { dropFloatingDonuts } from "./gamePlay.js";
import { context, canvas } from "./gameCanvas.js";

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

  // if (matches.length >= 3) {
  //   matches.forEach((bubble) => {
  //     bubble.active = false;
  //   });
  // }

  // Animate and then deactivate bubbles if there are enough matches

  if (matches.length >= 3) {
    matches.forEach((bubble) => {
      bubble.animating = true; // Mark the bubble as animating
      bubble.currentFrame = 0; // Start from the first frame
      bubble.frameCounter = 0; // Counter to track frame updates
      bubble.active = false;
    });

    const frameInterval = 3; // Number of animation loops per frame (lower is faster, higher is slower)

    function animateMatches() {
      let allFinished = true;

      matches.forEach((bubble) => {
        if (bubble.animating) {
          // Clear the donut area before redrawing it to avoid remnants from the previous frame
          context.save();
          context.clearRect(
            bubble.x - grid / 2, // X position of the donut
            bubble.y - grid / 2, // Y position of the donut
            grid, // Width of the area to clear
            grid // Height of the area to clear
          );
          context.restore();
          // Increment the frame only after a certain number of loops (frameInterval)
          if (bubble.frameCounter >= frameInterval) {
            bubble.currentFrame++; // Increment the current frame

            if (bubble.currentFrame >= spriteProperties.framesPerDonut) {
              bubble.animating = false; // Stop animating after the last frame
            }

            bubble.frameCounter = 0; // Reset the frame counter after increment
          }

          // Draw the current frame of the animation
          context.drawImage(
            bubble.img,
            bubble.currentFrame * spriteProperties.frameWidth, // X position in sprite sheet
            0, // Y position in sprite sheet
            spriteProperties.frameWidth,
            spriteProperties.frameHeight,
            bubble.x - grid / 2,
            bubble.y - grid / 2,
            grid,
            grid
          );

          bubble.frameCounter++; // Increment frame counter each animation loop
        }
      });

      // Continue the animation loop if not all animations are finished
      if (matches.some((bubble) => bubble.animating)) {
        requestAnimationFrame(animateMatches);
      }
      // else {
      //   // Mark bubbles as inactive once all animations are done
      //   matches.forEach((bubble) => {
      //     bubble.active = false;
      //   });
      // }
    }

    requestAnimationFrame(animateMatches);
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
