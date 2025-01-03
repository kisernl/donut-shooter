import { donutMap } from "./modules/donut.js";
import { grid } from "./modules/constants.js";
import { level1 } from "./modules/levels.js";
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

  // Animation loop
  function startGame() {
    if (gameStarted) {
      // fill the grid with inactive bubbles
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
          //if level has a bubble at location, create an active bubble rather than inactive one
          const donut = level1[row]?.[col];
          createBubble(col * grid, row * grid, donutMap[donut]);
        }
      }
      window.requestAnimationFrame(loop);
    } else {
      drawWelcomeMessage();
    }
  }

  // Start the game on Enter key press
  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !gameStarted) {
      gameStarted = true;
      startGame(); // Start the animation loop
    }
  });

  // Initial draw of the welcome message
  drawWelcomeMessage(context);
});
