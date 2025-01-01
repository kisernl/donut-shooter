import Donut from "./donut.js";

class RegRow {
  constructor(game, yPosition) {
    this.game = game;
    this.yPosition = yPosition;
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
      const x = this.spacing + i * (this.donutWidth + this.spacing); // Calculate x position
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

export default RegRow;
