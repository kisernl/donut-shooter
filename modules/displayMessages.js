import { context, canvas } from "./gameCanvas.js";
// Display "You Win" message
export function displayWinMessage() {
  // Set font properties
  context.font = "48px Arial"; // Font size and type
  context.fillStyle = "#87418c"; // Text color
  context.textAlign = "center"; // Align the text to the center
  context.textBaseline = "middle"; // Vertically align text to the middle

  // Get the canvas center position
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw the "You Win!" message
  context.fillText("You Win!", centerX, centerY);
}

// Display "You Lose" message
export function displayLoseMessage() {
  // Set font properties
  context.font = "48px Arial"; // Font size and type
  context.fillStyle = "#87418c"; // Text color
  context.textAlign = "center"; // Align the text to the center
  context.textBaseline = "middle"; // Vertically align text to the middle

  // Get the canvas center position
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw the "You Lose!" message
  context.fillText("GAME OVER!... loser.", centerX, centerY);
}
