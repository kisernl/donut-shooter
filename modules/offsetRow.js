// create a row of images to sit 0.5 offset from the regRow and provide alternating rows for the game
import Donut from "./donut.js";

class OffsetRow {
  constructor(game, yPosition, offset = 0) {
    this.game = game;
    this.yPosition = yPosition;
    this.offset = offset; // Horizontal offset for staggered rows
    this.donuts = [];
    this.donutCount = 8; // Number of donuts in a row
    this.spacing = 1; // Space between donuts

    // Calculate the available width for each donut
    this.donutWidth =
      (this.game.width - this.spacing * (this.donutCount + 1)) /
      this.donutCount;

    this.game.donutSize = this.donutWidth; // Pass size to the game

    this.initDonuts();
  }

  initDonuts() {
    for (let i = 0; i < this.donutCount; i++) {
      const x =
        this.offset + this.spacing + i * (this.donutWidth + this.spacing); // Add the offset
      this.donuts.push(new Donut(this.game, x, this.yPosition));
    }
  }

  draw(context) {
    this.donuts.forEach((donut) => donut.draw(context));
  }

  update() {
    this.donuts.forEach((donut) => donut.update());
  }
}

export default OffsetRow;
