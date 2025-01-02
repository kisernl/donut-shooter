class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.gameOver = false;

    this.grid = 128;

    this.bubbleGap = 1;
    this.wallSize = 4;
    this.bubbles = [];
    let particles = [];
  }

  render() {}
}

export default Game;
