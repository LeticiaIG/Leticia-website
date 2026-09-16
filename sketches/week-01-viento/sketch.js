// Garabato al viento (p5.js)
//
// Un lapiz hace garabatos sin parar. Cuando alguien se mueve delante de la
// camara, ese movimiento es VIENTO: empuja el lapiz en la direccion en la
// que te mueves y el garabato cambia de rumbo. Cuando paras, el viento se
// calma y el lapiz vuelve a garabatear a su aire.
//
// Teclas: FLECHAS = soplar a mano · R = borrar · S = guardar PNG
//         + / - = sensibilidad de la camara

let cam;
let camOK = false;

// ---- parametros (juega con estos numeros) ----
const SPEED      = 150;   // velocidad del lapiz (px/s)
const GARABATO   = 520;   // cuanto se retuerce el trazo (grados/s)
const VIENTO_MAX = 420;   // fuerza maxima del viento (px/s)
const CALMA      = 0.94;  // lo rapido que se calma el viento (0.90 rapido · 0.98 lento)
const HUD_H      = 110;   // franja inferior
const MAXV       = 6000;  // puntos maximos del rastro
const CAM_W = 160, CAM_H = 120;

// ---- lapiz ----
let pos, heading = 0, vel;
let verts = [];
let tRuido = 0;

// ---- viento ----
let viento;               // vector de viento actual (px/s)

// ---- camara ----
let prev = null;
let suave = 0;
let umbral = 6;
let centro = null, centroPrev = null;

let paperC, inkC, faintC, accentC;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  paperC  = color(245, 244, 239);
  inkC    = color(35, 40, 56);
  faintC  = color(35, 40, 56, 150);
  accentC = color(59, 98, 196);
  textFont('sans-serif');
  textSize(12);

  viento = createVector(0, 0);
  vel = createVector(0, 0);
  reiniciar();

  cam = createCapture(VIDEO, () => { camOK = true; });
  cam.size(CAM_W, CAM_H);
  cam.hide();
}

function reiniciar() {
  pos = createVector(width / 2, (height - HUD_H) / 2);
  heading = random(360);
  verts = [{ x: pos.x, y: pos.y }];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ---- la camara convierte tu movimiento en viento ----
function medirMovimiento() {
  cam.loadPixels();
  const px = cam.pixels;
  if (!px || px.length === 0) return;
  const w = cam.width, h = cam.height;
  const n = w * h;

  if (!prev || prev.length !== n) {
    prev = new Float32Array(n);
    for (let k = 0; k < n; k++) prev[k] = (px[k * 4] + px[k * 4 + 1] + px[k * 4 + 2]) / 3;
    return;
  }

  let suma = 0, sx = 0, sy = 0, peso = 0;
  for (let k = 0; k < n; k += 2) {
    const i = k * 4;
    const b = (px[i] + px[i + 1] + px[i + 2]) / 3;
    const d = Math.abs(b - prev[k]);
    prev[k] = b;
    suma += d;
    if (d > 25) {
      sx += (k % w) * d;
      sy += Math.floor(k / w) * d;
      peso += d;
    }
  }
  suave = 0.7 * suave + 0.3 * (suma / (n / 2));

  if (suave > umbral && peso > 0) {
    // centro del movimiento, en espejo (como mirarse al espejo)
    const c = createVector(1 - (sx / peso) / w, (sy / peso) / h);
    centro = centro ? p5.Vector.lerp(centro, c, 0.35) : c;

    if (centroPrev) {
      const dir = p5.Vector.sub(centro, centroPrev);   // hacia donde te mueves
      if (dir.mag() > 0.002) {
        dir.normalize();
        const fuerza = map(suave, umbral, umbral + 25, 40, 160, true);
        viento.add(dir.mult(fuerza));
      }
    }
    centroPrev = centro.copy();
  } else {
    centroPrev = null;
  }
}

function draw() {
  background(paperC);
  if (camOK && cam.width > 0) medirMovimiento();

  const dt = min(deltaTime / 1000, 0.05);
  const H2 = height - HUD_H;

  // el viento se calma poco a poco
  viento.mult(pow(CALMA, dt * 60));
  viento.limit(VIENTO_MAX);

  // garabato: el rumbo se retuerce con ruido
  tRuido += dt * 0.9;
  heading += (noise(tRuido) - 0.5) * 2 * GARABATO * dt;

  // con viento fuerte, el lapiz se orienta hacia donde sopla
  const fv = viento.mag() / VIENTO_MAX;
  if (fv > 0.05) {
    const dv = viento.heading();
    const diff = ((dv - heading + 540) % 360) - 180;
    heading += diff * min(1, fv * 6 * dt);
  }

  // cerca del borde, girar hacia dentro
  const m = 60;
  if (pos.x < m || pos.x > width - m || pos.y < m || pos.y > H2 - m) {
    const haciaCentro = atan2(H2 / 2 - pos.y, width / 2 - pos.x);
    const diff = ((haciaCentro - heading + 540) % 360) - 180;
    heading += diff * min(1, 3 * dt);
  }

  // mover: rumbo propio + viento
  vel.set(cos(heading) * SPEED, sin(heading) * SPEED).add(viento);
  pos.add(p5.Vector.mult(vel, dt));
  pos.x = constrain(pos.x, 4, width - 4);
  pos.y = constrain(pos.y, 4, H2 - 4);

  const ult = verts[verts.length - 1];
  if (dist(ult.x, ult.y, pos.x, pos.y) > 2) verts.push({ x: pos.x, y: pos.y });
  while (verts.length > MAXV) verts.shift();

  // el rastro
  stroke(inkC);
  strokeWeight(1.4);
  noFill();
  beginShape();
  for (const v of verts) vertex(v.x, v.y);
  vertex(pos.x, pos.y);
  endShape();

  dibujarLapiz(pos.x, pos.y, vel.heading());
  hud();
}

// ---- el lapiz: la punta esta en (x, y) ----
function dibujarLapiz(x, y, ang) {
  const L = 70, W = 12, P = 18;
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(0, 0, 0, 18);
  rect(-P - L + 3, -W / 2 + 4, L + P - 4, W, 3);
  stroke(inkC);
  strokeWeight(1.2);
  fill(232, 150, 160);  rect(-P - L - 12, -W / 2, 12, W, 3, 0, 0, 3);  // goma
  fill(190, 190, 195);  rect(-P - L - 2, -W / 2, 8, W);                // metal
  fill(242, 196, 70);   rect(-P - L + 6, -W / 2, L - 6, W);            // cuerpo
  line(-P - L + 6, 0, -P, 0);
  fill(235, 205, 160);  triangle(-P, -W / 2, -P, W / 2, 0, 0);         // madera
  fill(inkC);           triangle(-P * 0.35, -W * 0.18, -P * 0.35, W * 0.18, 0, 0); // mina
  pop();
}

// ---- franja inferior ----
function hud() {
  const hy = height - HUD_H;
  stroke(red(inkC), green(inkC), blue(inkC), 40);
  strokeWeight(1);
  line(24, hy, width - 24, hy);

  if (camOK && cam.width > 0) {
    push();
    translate(24 + 120, hy + 10);
    scale(-1, 1);
    image(cam, 0, 0, 120, 90);
    pop();
    noFill();
    stroke(inkC);
    rect(24, hy + 10, 120, 90);
  } else {
    fill(faintC);
    noStroke();
    textAlign(LEFT, BASELINE);
    text('Esperando la camara (acepta el permiso). Mientras, sopla con las FLECHAS.', 24, hy + 34);
  }

  // veleta: flecha con la direccion y fuerza del viento
  const vx = width / 2, vy = hy + 55;
  noFill();
  stroke(red(inkC), green(inkC), blue(inkC), 60);
  circle(vx, vy, 70);
  const f = viento.mag() / VIENTO_MAX;
  if (f > 0.02) {
    push();
    translate(vx, vy);
    rotate(viento.heading());
    stroke(accentC);
    strokeWeight(2);
    const len = 8 + f * 26;
    line(-len, 0, len, 0);
    line(len, 0, len - 7, -5);
    line(len, 0, len - 7, 5);
    pop();
  }

  fill(faintC);
  noStroke();
  textAlign(RIGHT, BASELINE);
  text('viento ' + nf(f * 100, 0, 0) + '% · sensibilidad ' + nf(umbral, 0, 0) + ' (+ / -)', width - 24, hy + 34);
  text('FLECHAS soplar · R borrar · S guardar PNG', width - 24, hy + 54);
}

// ---- teclado ----
function keyPressed() {
  const soplo = 220;
  if (keyCode === LEFT_ARROW)  { viento.add(-soplo, 0); return false; }
  if (keyCode === RIGHT_ARROW) { viento.add(soplo, 0);  return false; }
  if (keyCode === UP_ARROW)    { viento.add(0, -soplo); return false; }
  if (keyCode === DOWN_ARROW)  { viento.add(0, soplo);  return false; }
  if (key === 'r' || key === 'R') reiniciar();
  else if (key === 's' || key === 'S') saveCanvas('garabato-viento', 'png');
  else if (key === '+' || key === '=') umbral = Math.min(40, umbral + 1);
  else if (key === '-') umbral = Math.max(1, umbral - 1);
}
