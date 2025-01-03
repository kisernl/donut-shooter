import { donutMap } from "./modules/donut.js";
import { grid } from "./modules/constants.js";
import { level1 } from "./modules/levels.js";
import { createBubble } from "./modules/gameFunctions.js";
import { loop } from "./modules/gamePlay.js";

// fill the grid with inactive bubbles
for (let row = 0; row < 10; row++) {
  for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
    //if level has a bubble at location, create an active bubble rather than inactive one
    const donut = level1[row]?.[col];
    createBubble(col * grid, row * grid, donutMap[donut]);
  }
}

// start the game
requestAnimationFrame(loop);
