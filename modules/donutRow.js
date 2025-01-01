import Donut from "./donut.js";

class DonutRow {
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
    if (this.offset === 0) {
      for (let i = 0; i < this.donutCount; i++) {
        const x =
          this.offset + this.spacing + i * (this.donutWidth + this.spacing); // Add the offset
        this.donuts.push(new Donut(this.game, x, this.yPosition));
      }
    } else {
      this.donutCount = this.donutCount - 1;
      for (let i = 0; i < this.donutCount; i++) {
        const x =
          this.offset + this.spacing + i * (this.donutWidth + this.spacing); // Add the offset
        this.donuts.push(new Donut(this.game, x, this.yPosition));
      }
    }
  }

  draw(context) {
    this.donuts.forEach((donut) => donut.draw(context));
  }

  update() {
    this.donuts.forEach((donut) => donut.update());
  }
}

export default DonutRow;
