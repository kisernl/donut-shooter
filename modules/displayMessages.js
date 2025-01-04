import { gameState } from "../main.js";
import { context, canvas } from "./gameCanvas.js";
// Display "You Win" message
export function displayWinMessage() {
  // Set font properties
  context.font = "125px Bubblegum Sans"; // Font size and type
  context.fillStyle = "#87418c"; // Text color
  context.textAlign = "center"; // Align the text to the center
  context.textBaseline = "middle"; // Vertically align text to the middle

  // Get the canvas center position
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 3;

  // Draw the "You Win!" message
  context.fillText(
    `Level ${gameState.currentLevel + 1} Cleared!`,
    centerX,
    centerY
  );
}

export function displayFinalWinMessage() {
  context.font = "125px Bubblegum Sans"; // Font size and type
  context.fillStyle = "#87418c"; // Text color
  context.textAlign = "center"; // Align the text to the center
  context.textBaseline = "middle"; // Vertically align text to the middle

  // Get the canvas center position
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 3;

  // Draw the "You Win!" message
  context.fillText(
    `You've cleared all ${gameState.currentLevel + 1} levels!`,
    centerX,
    centerY
  );
  context.fillText(`more levels coming soon...`, centerX, centerY + 200);
}

// Display "You Lose" message
export function displayLoseMessage() {
  // Set font properties
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.55)"; // Set background color with opacity
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  context.shadowColor = "#fff";
  context.font = "125px Bubblegum Sans"; // Font size and type
  context.fillStyle = "#87418c"; // Text color
  context.textAlign = "center"; // Align the text to the center
  context.textBaseline = "middle"; // Vertically align text to the middle

  // Get the canvas center position
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 3;

  // Draw the "You Lose!" message
  context.fillText("GAME OVER!", centerX, centerY);
  context.font = "75px Bubblegum Sans"; // Font size and type
  context.fillText(`press "Enter" to try again`, centerX, centerY + 200);
  context.restore();
}
