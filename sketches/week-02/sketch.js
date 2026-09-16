// Drawing ++ — plantilla (template) para una nueva semana
// The canvas fills the frame on the website.

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
}

function draw() {
  fill(0, 18);
  rect(0, 0, width, height);
  fill(232, 150, 126);
  const r = 20 + 15 * sin(frameCount * 0.05);
  circle(mouseX || width / 2, mouseY || height / 2, r);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
