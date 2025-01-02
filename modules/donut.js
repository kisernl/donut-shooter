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

const donutMap = {
  P: donutImages[0], // pink donut
  W: donutImages[1], // white donut
  C: donutImages[2], // chocolate donut
  B: donutImages[3], // blue donut
};
const donuts = Object.values(donutMap);
