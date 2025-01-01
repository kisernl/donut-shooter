class Donut {
  constructor(game, positionX, positionY) {
    this.game = game;
    this.width = game.donutSize || 48; // Default size if not provided
    this.height = game.donutSize || 48;
    this.x = positionX;
    this.y = positionY;
    this.markedForDeletion = false;

    // Load donut images
    const donutImages = [];
    const imagePaths = [
      "img/pink_donut.png",
      "img/white_donut.png",
      "img/chocolate_donut.png",
      "img/blue_donut.png",
    ];

    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
      donutImages.push(img);
    });

    const randomDonut = Math.floor(Math.random() * donutImages.length);
    this.image = donutImages[randomDonut];
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    // Placeholder for future updates
  }
}

export default Donut;
