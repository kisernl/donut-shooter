// set up canvas
const canvas = document.getElementById("game_canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = true; // Enable image smoothing
context.imageSmoothingQuality = "high"; // Use high-quality interpolation
// canvas.width = 271;
// canvas.height = 392;
canvas.width = 813;
canvas.height = 1176;
canvas.width = 1040;
canvas.height = 1568;

// load donut images
const donutImages = [];
const imagePaths = [
  "img/pink_donut.png",
  "img/white_donut.png",
  "img/chocolate_donut.png",
  "img/blue_donut.png",
];

imagePaths.forEach((path, index) => {
  const img = new Image();
  img.src = path;
  donutImages.push(img);
});

console.log(donutImages);

// define variables for game
const grid = 128;

const level1 = [
  ["P", "P", "B", "B", "C", "C", "W", "W"],
  ["P", "P", "B", "B", "C", "C", "W"],
  ["C", "C", "W", "W", "P", "P", "B", "B"],
  ["C", "W", "W", "P", "P", "B", "B"],
];

const donutMap = {
  P: donutImages[0], // pink donut
  W: donutImages[1], // white donut
  C: donutImages[2], // chocolate donut
  B: donutImages[3], // blue donut
};
const donuts = Object.values(donutMap);

const bubbleGap = 1;
const wallSize = 4;
const bubbles = [];
let particles = [];

const donutSize = 32;

// HELPER FUNCTIONS
// helper function to convert deg to radians
function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

// rotate a point by an angle
function rotatePoint(x, y, angle) {
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);

  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

// get random int between range of [min,max]
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get distance between 2 points
function getDistance(obj1, obj2) {
  const distX = obj1.x - obj2.x;
  const distY = obj1.y - obj2.y;
  return Math.sqrt(distX * distX + distY * distY);
}

// check for collision between two circles
function collides(obj1, obj2) {
  return getDistance(obj1, obj2) < obj1.radius + obj2.radius;
}

// find closest bubble that collides with object
function getClosestBubble(obj, activeState = false) {
  const closestBubbles = bubbles.filter(
    (bubble) => bubble.active == activeState && collides(obj, bubble)
  );

  if (!closestBubbles.length) {
    return;
  }

  return (
    closestBubbles
      // turn array of bubbles into array of distances
      .map((bubble) => {
        return {
          distance: getDistance(obj, bubble),
          bubble,
        };
      })
      .sort((a, b) => a.distance - b.distance)[0].bubble
  );
}

// Update `createBubble` to correctly draw the image
function createBubble(x, y, img) {
  const row = Math.floor(y / grid);
  const col = Math.floor(x / grid);

  const startX = row % 2 === 0 ? 0 : 0.5 * grid;
  const center = grid * 0.5;

  bubbles.push({
    x: wallSize + (grid + bubbleGap) * col + startX + center,
    y: wallSize + (grid + bubbleGap - 4) * row + center,
    radius: grid / 2,
    img: img, // Use the donut image
    active: img ? true : false,
  });
}

// get all bubbles that touch the passed in bubble
function getNeighbors(bubble) {
  const neighbors = [];

  // check each of the 6 directions by "moving" the bubble by a full
  // grid in each of the 6 directions (60 degree intervals)
  const dirs = [
    // right
    rotatePoint(grid, 0, 0),
    // up-right
    rotatePoint(grid, 0, degToRad(60)),
    // up-left
    rotatePoint(grid, 0, degToRad(120)),
    // left
    rotatePoint(grid, 0, degToRad(180)),
    // down-left
    rotatePoint(grid, 0, degToRad(240)),
    // down-right
    rotatePoint(grid, 0, degToRad(300)),
  ];

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];

    const newBubble = {
      x: bubble.x + dir.x,
      y: bubble.y + dir.y,
      radius: bubble.radius,
    };
    const neighbor = getClosestBubble(newBubble, true);
    if (neighbor && neighbor !== bubble && !neighbors.includes(neighbor)) {
      neighbors.push(neighbor);
    }
  }
  return neighbors;
}

// remove bubbles that create a match of 3 images
function removeMatch(targetBubble) {
  const matches = [targetBubble];

  bubbles.forEach((bubble) => (bubble.processed = false));
  targetBubble.processed = true;

  //loop over neighbors of matching images for more matches
  let neighbors = getNeighbors(targetBubble);
  for (let i = 0; i < neighbors.length; i++) {
    let neighbor = neighbors[i];

    if (!neighbor.processed) {
      neighbor.processed = true;

      if (neighbor.img === targetBubble.img) {
        matches.push(neighbor);
        neighbors = neighbors.concat(getNeighbors(neighbor));
      }
    }
  }

  if (matches.length >= 3) {
    matches.forEach((bubble) => {
      bubble.active = false;
    });
  }
}

// make floating donuts drop down the screen
function dropFloatingDonuts() {
  const activeDonuts = bubbles.filter((bubble) => bubble.active); // Assuming donuts is the array of active donut objects
  activeDonuts.forEach((bubble) => (bubble.processed = false));

  // Start with donuts touching the top border of the canvas
  let neighbors = activeDonuts.filter((bubble) => bubble.y - grid <= wallSize);

  // Process all donuts that form a chain with the top border donuts
  for (let i = 0; i < neighbors.length; i++) {
    let neighbor = neighbors[i];

    if (!neighbor.processed) {
      neighbor.processed = true;
      neighbors = neighbors.concat(getNeighbors(neighbor)); // Define how neighbors are identified
    }
  }

  // Any donut that isn't processed and doesn't touch the top border
  activeDonuts
    .filter((bubble) => !bubble.processed)
    .forEach((bubble) => {
      bubble.active = false; // Deactivate donuts that are no longer active
      // Create a new particle for each donut that "falls"
      particles.push({
        x: bubble.x,
        y: bubble.y,
        img: bubble.img,
        radius: bubble.radius,
        active: true,
      });
    });
}

// fill the grid with inactive bubbles
for (let row = 0; row < 10; row++) {
  for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
    //if level has a bubble at location, create an active bubble rather than inactive one
    const donut = level1[row]?.[col];
    createBubble(col * grid, row * grid, donutMap[donut]);
  }
}

const curBubblePos = {
  //place the current bubble horizontally in middle of screen
  x: canvas.width * 0.5,
  y: canvas.height - grid * 1.5,
};
const curBubble = {
  x: curBubblePos.x,
  y: curBubblePos.y,
  img: donutImages[0],
  radius: grid * 0.5, // a circles radius is half the width (diameter)

  //how fast the bubble should go in either the x or y direction
  speed: 32,

  // bubble velocity
  dx: 0,
  dy: 0,
};

// angle (in radians) of the shooting arrow
let shootDeg = 0;

// min/max angle (in radians) of the shooting arrow
const minDeg = degToRad(-60);
const maxDeg = degToRad(60);

//the direction of movement for he arrow (-1 = left, 1 = right)
let shootDir = 0;

// reset the bubble to shoot to the bottom of screen
function getNewBubble() {
  curBubble.x = curBubblePos.x;
  curBubble.y = curBubblePos.y;
  curBubble.dx = curBubble.dy = 0;

  const randInt = getRandomInt(onabort, donuts.length - 1);
  curBubble.img = donuts[randInt];
}

// handle collision between current bubble and another bubble
function handleCollision(bubble) {
  bubble.img = curBubble.img;
  bubble.active = true;
  getNewBubble();
  removeMatch(bubble);
  // dropFloatingBubbles();
  dropFloatingDonuts();
  console.log(particles);
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move shooting arrow
  shootDeg = shootDeg + degToRad(2) * shootDir;

  if (shootDeg < minDeg) {
    shootDeg = minDeg;
  } else if (shootDeg > maxDeg) {
    shootDeg = maxDeg;
  }

  // move current bubble by it's velocity
  curBubble.x += curBubble.dx;
  curBubble.y += curBubble.dy;

  // prevent bubble from going thorough walls by changing its velocity
  if (curBubble.x - grid * 0.5 < wallSize) {
    curBubble.x = wallSize + grid * 0.5;
    curBubble.dx *= -1;
  } else if (curBubble.x + grid * 0.5 > canvas.width - wallSize) {
    curBubble.x = canvas.width - wallSize - grid * 0.5;
    curBubble.dx *= -1;
  }

  //check to see if bubble collides with top border of canvas
  if (curBubble.y - grid * 0.5 < wallSize) {
    //make the closest inactive bubble active
    const closestBubble = getClosestBubble(curBubble);
    handleCollision(closestBubble);
  }

  // check to see if bubble collides with another bubble
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];

    if (bubble.active && collides(curBubble, bubble)) {
      const closestBubble = getClosestBubble(curBubble);
      // if (!closestBubble) {
      //   window.alert("Game Over");
      //   window.location.reload();
      // }

      if (closestBubble) {
        handleCollision(closestBubble);
      }
    }
  }
  // move bubble particles
  particles.forEach((particle) => {
    particle.y += 24;
  });

  // remove particles that fall off screen
  particles = particles.filter(
    (particles) => particles.y < canvas.height - grid * 0.5
  );

  // Draw bubbles in the `loop` function
  bubbles.forEach((bubble) => {
    if (bubble.active) {
      context.drawImage(
        bubble.img,
        bubble.x - grid / 2,
        bubble.y - grid / 2,
        grid,
        grid
      );
    }
  });

  // draw bubbles and particles
  particles.forEach((particle) => {
    if (particle.active) {
      context.drawImage(
        particle.img,
        particle.x - grid / 2,
        particle.y - grid / 2,
        grid,
        grid
      );
    }
  });

  //draw fire arrow to center of rotation/bubble
  // use save to start and restore when done
  context.save();

  // move to cent of rotation/bubble
  context.translate(curBubblePos.x, curBubblePos.y);
  context.rotate(shootDeg);

  // move to to top-left corner of fire arrow
  context.translate(0, -grid * 0.5 * 4.5);

  // draw arrow
  context.strokeStyle = "#87418c";
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, grid * 2);
  context.moveTo(0, 0);
  context.lineTo(-14, grid * 0.4);
  context.moveTo(0, 0);
  context.lineTo(14, grid * 0.4);
  context.stroke();

  context.restore();

  // draw current bubble
  context.drawImage(
    curBubble.img,
    curBubble.x - grid / 2,
    curBubble.y - grid / 2,
    grid,
    grid
  );
}

// listen for keyboard events to move fire arrow
document.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);
  if (e.key === "ArrowLeft") {
    shootDir = -1;
  } else if (e.key === "ArrowRight") {
    shootDir = 1;
  }

  if (e.key === " " && curBubble.dx === 0 && curBubble.dy === 0) {
    //convert an angle to x/y
    curBubble.dx = Math.sin(shootDeg) * curBubble.speed;
    curBubble.dy = -Math.cos(shootDeg) * curBubble.speed;
    console.log("Fired:", curBubble.dx, curBubble.dy); // Debug log
  }
});

// Listen for keyboard even to stop moving fire arrow when key released
document.addEventListener("keyup", (e) => {
  if (
    // only reset shoot dir if the released key is also the current direction of movement. otherwise if you press down both arrow keys at same time and then release on, the arrow stops moving even though you're still pressing a key
    (e.key === "ArrowLeft" && shootDir === -1) ||
    (e.key === "ArrowRight" && shootDir === 1)
  ) {
    shootDir = 0;
  }
});

0;

// start the game
requestAnimationFrame(loop);
