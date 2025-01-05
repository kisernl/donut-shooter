import { donutMap } from "./modules/donut.js";
import { grid } from "./modules/constants.js";
import { levels } from "./modules/levels.js";
import { createBubble } from "./modules/gameFunctions.js";
import { loop } from "./modules/gamePlay.js";
import { context, canvas } from "./modules/gameCanvas.js";

// window.addEventListener("load", function () {
// // fill the grid with inactive bubbles
// for (let row = 0; row < 10; row++) {
//   for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
//     //if level has a bubble at location, create an active bubble rather than inactive one
//     const donut = level1[row]?.[col];
//     createBubble(col * grid, row * grid, donutMap[donut]);
//   }
// }

// // start the game
// requestAnimationFrame(loop);
// }

export let gameState = {
  currentLevel: 0,
};

export function startLevel() {
  const level = levels[gameState.currentLevel];
  if (!level) {
    console.error(`Level ${gameState.currentLevel} does not exist!`);
    return;
  }

  // Clear the canvas and bubbles array if needed
  context.clearRect(0, 0, canvas.width, canvas.height);
  //bubbles.length = 0; // Clear any existing bubbles

  // Populate the grid with bubbles for the current level
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
      const donut = level[row]?.[col];
      createBubble(col * grid, row * grid, donutMap[donut]);
    }
  }

  window.requestAnimationFrame(loop); // Restart the game loop
}

window.addEventListener("load", function () {
  let gameStarted = false;

  function drawWelcomeMessage(context) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "#ff90c7";
    context.textAlign = "center";
    context.fillStyle = "#87418c";
    context.font = "500 145px Bubblegum Sans";
    context.fillText("Donut Shooter", canvas.width * 0.5, canvas.height * 0.25);
    context.font = "500 60px Bubblegum Sans";
    context.fillText(
      "Arrow Left / Arrow Right to Aim",
      canvas.width * 0.5,
      canvas.height * 0.35
    );
    context.fillText(
      `& "Spacebar" to shoot!`,
      canvas.width * 0.5,
      canvas.height * 0.4
    );
    context.font = "500 115px Bubblegum Sans";
    context.fillText(
      "Press Enter to Start",
      canvas.width * 0.5,
      canvas.height * 0.75
    );
    context.restore();
  }

  // FontFace API to check if the font is loaded
  const font = new FontFace(
    "Bubblegum Sans",
    "url(assets/fonts/BubblegumSans-Regular.ttf)"
  );
  font
    .load()
    .then(() => {
      document.fonts.add(font);
      // Once the font is loaded, start the game by showing the welcome message
      drawWelcomeMessage(context);
    })
    .catch((error) => {
      console.error("Font loading failed: ", error);
      // If font fails to load, proceed anyway
      drawWelcomeMessage(context);
    });

  // Animation loop
  // function startGame() {
  //   if (gameStarted) {
  //     let level = levels[0];
  //     // fill the grid with inactive bubbles
  //     for (let row = 0; row < 10; row++) {
  //       for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
  //         //if level has a bubble at location, create an active bubble rather than inactive one
  //         const donut = level[row]?.[col];
  //         createBubble(col * grid, row * grid, donutMap[donut]);
  //       }
  //     }
  //     window.requestAnimationFrame(loop);
  //   } else {
  //     drawWelcomeMessage();
  //   }
  // }

  // export function startGame() {
  //   const level = levels[currentLevel];
  //   if (!level) {
  //     console.error(`Level ${currentLevel} does not exist!`);
  //     return;
  //   }

  //   // Clear the canvas and bubbles array if needed
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   //bubbles.length = 0; // Clear any existing bubbles

  //   // Populate the grid with bubbles for the current level
  //   for (let row = 0; row < 10; row++) {
  //     for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
  //       const donut = level[row]?.[col];
  //       createBubble(col * grid, row * grid, donutMap[donut]);
  //     }
  //   }

  //   window.requestAnimationFrame(loop); // Restart the game loop
  // }

  if (gameStarted) startLevel();

  // Start the game on Enter key press
  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !gameStarted) {
      gameStarted = true;
      startLevel(); // Start the animation loop
    }
  });

  // Initial draw of the welcome message
  drawWelcomeMessage(context);
});
