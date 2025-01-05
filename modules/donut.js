export const donutImages = [];
// export const imagePaths = [
//   "img/pink_donut.png",
//   "img/white_donut.png",
//   "img/chocolate_donut.png",
//   "img/blue_donut.png",
// ];

// imagePaths.forEach((path, index) => {
//   const img = new Image();
//   img.src = path;
//   donutImages.push(img);
// });

export const imagePaths = [
  "img/spriteSheets/pink_donut_sprite_sheet.png",
  "img/spriteSheets/white_donut_sprite_sheet.png",
  "img/spriteSheets/chocolate_donut_sprite_sheet.png",
  "img/spriteSheets/blue_donut_sprite_sheet.png",
];
imagePaths.forEach((path, index) => {
  const img = new Image();
  img.src = path;
  donutImages.push(img);
});

export const donutMap = {
  P: donutImages[0], // pink donut
  W: donutImages[1], // white donut
  C: donutImages[2], // chocolate donut
  B: donutImages[3], // blue donut
};
export const donuts = Object.values(donutMap);

export const spriteProperties = {
  frameWidth: 160, // Width of a single frame
  frameHeight: 160, // Height of a single frame
  framesPerDonut: 6, // Number of animation frames per donut
};
