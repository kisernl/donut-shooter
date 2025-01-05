import { context, canvas } from "./gameCanvas.js";
import { startLevel, gameState } from "../main.js";
import { degToRad, collides } from "./utils.js";
import {
  minDeg,
  maxDeg,
  curBubble,
  grid,
  wallSize,
  bubbles,
  curBubblePos,
} from "./constants.js";
import {
  checkWinCondition,
  getClosestBubble,
  handleCollision,
  getNeighbors,
  levelReset,
} from "./gameFunctions.js";
import {
  displayWinMessage,
  displayLoseMessage,
  displayFinalWinMessage,
} from "./displayMessages.js";
import { levels } from "./levels.js";

let particles = [];

// angle (in radians) of the shooting arrow
let shootDeg = 0;

//the direction of movement for he arrow (-1 = left, 1 = right)
let shootDir = 0;

let gameOver = false;
let levelCleared = false;

// make floating donuts drop down the screen
export function dropFloatingDonuts() {
  const activeDonuts = bubbles.filter((bubble) => bubble.active); // Assuming donuts is the array of active donut objects
  activeDonuts.forEach((bubble) => (bubble.processed = false));

  // Start with donuts touching the top border of the canvas
  let neighbors = activeDonuts.filter((bubble) => bubble.y - grid <= wallSize);

  // Process all donuts that form a chain with the top border donuts
  for (let i = 0; i < neighbors.length; i++) {
    let neighbor = neighbors[i];

    if (!neighbor.processed) {
      neighbor.processed = true;
      neighbors = neighbors.concat(getNeighbors(neighbor)); // Define how neighbors are identified
    }
  }

  // Any donut that isn't processed and doesn't touch the top border
  activeDonuts
    .filter((bubble) => !bubble.processed)
    .forEach((bubble) => {
      bubble.active = false; // Deactivate donuts that are no longer active
      // Create a new particle for each donut that "falls"
      particles.push({
        x: bubble.x,
        y: bubble.y,
        img: bubble.img,
        radius: bubble.radius,
        active: true,
      });
    });
}

// game loop
let animationFrameId;

export function loop() {
  if (!gameOver) {
    animationFrameId = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // move shooting arrow
    shootDeg = shootDeg + degToRad(2) * shootDir;

    if (shootDeg < minDeg) {
      shootDeg = minDeg;
    } else if (shootDeg > maxDeg) {
      shootDeg = maxDeg;
    }

    // move current bubble by it's velocity
    curBubble.x += curBubble.dx;
    curBubble.y += curBubble.dy;

    // prevent bubble from going thorough walls by changing its velocity
    if (curBubble.x - grid * 0.5 < wallSize) {
      curBubble.x = wallSize + grid * 0.5;
      curBubble.dx *= -1;
    } else if (curBubble.x + grid * 0.5 > canvas.width - wallSize) {
      curBubble.x = canvas.width - wallSize - grid * 0.5;
      curBubble.dx *= -1;
    }

    //check to see if bubble collides with top border of canvas
    if (curBubble.y - grid * 0.5 < wallSize) {
      //make the closest inactive bubble active
      const closestBubble = getClosestBubble(curBubble);
      handleCollision(closestBubble);
    }

    // move bubble particles
    particles.forEach((particle) => {
      particle.y += 32;
    });

    // remove particles that fall off screen
    particles = particles.filter(
      (particles) => particles.y < canvas.height - grid * 0.5
    );

    // Draw bubbles in the `loop` function
    bubbles.forEach((bubble) => {
      if (bubble.active) {
        // context.drawImage(
        //   bubble.img,
        //   bubble.x - grid / 2,
        //   bubble.y - grid / 2,
        //   grid,
        //   grid
        // );

        context.drawImage(
          bubble.img, // The sprite sheet image for this bubble
          0, // X position of the frame in the sprite sheet
          0, // Y position of the frame in the sprite sheet
          160, // Width of the frame in the sprite sheet
          160, // Height of the frame in the sprite sheet
          bubble.x - grid / 2, // X position on the canvas
          bubble.y - grid / 2, // Y position on the canvas
          grid, // Width on the canvas
          grid // Height on the canvas
        );
      }
    });

    // draw bubbles and particles
    particles.forEach((particle) => {
      if (particle.active) {
        context.drawImage(
          particle.img,
          0, // X position of the frame in the sprite sheet
          0, // Y position of the frame in the sprite sheet
          160, // Width of the frame in the sprite sheet
          160, // Height of the frame in the sprite sheet
          particle.x - grid / 2,
          particle.y - grid / 2,
          grid,
          grid
        );
      }
    });

    // check to see if bubble collides with another bubble
    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i];

      if (bubble.active && collides(curBubble, bubble)) {
        const closestBubble = getClosestBubble(curBubble);
        if (!closestBubble) {
          gameOver = true;
          displayLoseMessage();
        }
        if (closestBubble) {
          handleCollision(closestBubble);
        }
      }
    }

    //draw fire arrow to center of rotation/bubble
    // use save to start and restore when done
    context.save();

    // move to cent of rotation/bubble
    context.translate(curBubblePos.x, curBubblePos.y);
    context.rotate(shootDeg);

    // move to to top-left corner of fire arrow
    context.translate(0, -grid * 0.5 * 4.5);

    // draw arrow
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

    // draw current bubble
    context.drawImage(
      curBubble.img,
      0, // X position of the frame in the sprite sheet
      0, // Y position of the frame in the sprite sheet
      160, // Width of the frame in the sprite sheet
      160, // Height of the frame in the sprite sheet
      curBubble.x - grid / 2,
      curBubble.y - grid / 2,
      grid,
      grid
    );

    checkLevelWin();
  }
}

export function stopLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null; // Reset the frame ID
  }
}

// export function endGame() {
//   displayLoseMessage();
// }

// function checkLevelWin() {
//   if (checkWinCondition()) {
//     displayWinMessage();
//     levelCleared = true;
//   }
// }

function checkLevelWin() {
  if (checkWinCondition()) {
    if (gameState.currentLevel < levels.length - 2) displayWinMessage();

    if (particles.length === 0) {
      levelCleared = true;
      levelReset();
      stopLoop();
      console.log("looped stopped");
      // Proceed to the next level after a short delay
      setTimeout(() => {
        if (gameState.currentLevel < levels.length - 1) {
          gameState.currentLevel++;
          levelCleared = false;
          startLevel(); // Start the next level
        } else {
          displayFinalWinMessage();
          gameOver = true; // Display a message when all levels are completed
        }
      }, 2000); // Delay to let the win message show
    }
  }

  // if (checkWinCondition()) {
  //   setTimeout(() => {
  //     levelCleared = true;
  //     levelReset();
  //     stopLoop();
  //     console.log("looped stopped");
  //   }, 1000);
  // }
}

// window.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     if (!gameStarted) {
//       gameStarted = true;
//       startGame();
//     } else if (levelCleared) {
//       levelCleared = false; // Reset for the next level
//       if (currentLevel < levels.length) {
//         startGame();
//       } else {
//         displayFinalWinMessage();
//       }
//     }
//   }
// });

// listen for keyboard events to move fire arrow
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    shootDir = -1;
  } else if (e.key === "ArrowRight") {
    shootDir = 1;
  }

  if (
    e.key === " " &&
    curBubble.dx === 0 &&
    curBubble.dy === 0 &&
    !gameOver &&
    !levelCleared
  ) {
    //convert an angle to x/y
    curBubble.dx = Math.sin(shootDeg) * curBubble.speed;
    curBubble.dy = -Math.cos(shootDeg) * curBubble.speed;
  }

  if (e.key === "Enter" && gameOver) window.location.reload();
});

// Listen for keyboard even to stop moving fire arrow when key released
document.addEventListener("keyup", (e) => {
  if (
    // only reset shoot dir if the released key is also the current direction of movement. otherwise if you press down both arrow keys at same time and then release on, the arrow stops moving even though you're still pressing a key
    (e.key === "ArrowLeft" && shootDir === -1) ||
    (e.key === "ArrowRight" && shootDir === 1)
  ) {
    shootDir = 0;
  }
});
