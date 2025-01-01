import DonutRow from "./donutRow.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.rowHeight = 10;

    // Create the top row
    this.regularRow = new DonutRow(this, this.rowHeight, 0);

    // Create the offset row, positioned just below the top row
    this.offsetRow = new DonutRow(
      this,
      this.rowHeight - 4 + this.donutSize,
      this.donutSize / 2
    );
  }

  render(context) {
    this.regularRow.draw(context);
    this.offsetRow.draw(context);
  }
}

export default Game;
