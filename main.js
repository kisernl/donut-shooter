import Game from "./modules/game.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("game_canvas");
  const context = canvas.getContext("2d");
  canvas.width = 271;
  canvas.height = 392;

  const game = new Game(canvas);

  // Game loop
  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    game.render(context); // Render the game
    requestAnimationFrame(animate); // Continue the loop
  }

  animate(); // Start the game loop
});
