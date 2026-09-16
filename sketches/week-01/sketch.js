// EventosGiros — un dibujo dirigido por eventos (version p5.js)
//
// Un lapiz avanza SIEMPRE a velocidad constante: el tiempo hecho visible.
// Cada vez que la camara detecta movimiento se dispara un evento, y el
// manejador hace una sola cosa: girar el rumbo del lapiz. Asi, cada tramo
// recto mide literalmente el tiempo entre dos eventos, y en cada giro queda
// un ojo de almendra mirando hacia la nueva direccion (iris ambar = eventos
// seguidos, azul = hubo que esperar).
//
// Como usarlo: pega este codigo en sketch.js en editor.p5js.org, dale a Play
// y acepta el permiso de camara. No necesita ninguna libreria extra.
// Teclas: ESPACIO = evento manual · 1/2/3 = tipo de giro · R = borrar
//         S = guardar PNG · + / - = sensibilidad

let cam;
let camOK = false;

// ---- parametros ----
const SPEED = 60;    // pixeles por segundo del lapiz (tiempo -> longitud)
const HUD_H = 140;   // franja inferior (camara + estado)
const MAXV  = 500;   // vertices maximos guardados
const MAXDT = 5;     // segundos a los que el iris llega al azul

// ---- estado del lapiz ----
let pos;             // posicion actual
let heading = 0;     // rumbo en grados
let verts = [];      // vertices: {x, y, jump, dt, heading}
let lastT = 0;       // millis() del ultimo evento
let nEventos = 0;
let modo = 1;        // 1 = angulo recto, 2 = zigzag 45, 3 = aleatorio
let signoZig = 1;

// ---- deteccion de movimiento ----
let prev = null;
let suave = 0;
let umbralAlto = 12;
let armado = true;
let ultDisparo = 0;

let paperC, inkC, faintC, scleraC, accentC;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);
  strokeJoin(ROUND);
  paperC  = color(245, 244, 239);
  inkC    = color(35, 40, 56);
  faintC  = color(35, 40, 56, 150);
  scleraC = color(253, 252, 248);
  accentC = color(59, 98, 196);
  textFont('sans-serif');
  textSize(12);

  pos = createVector(width / 2, (height - HUD_H) / 2);
  verts.push({ x: pos.x, y: pos.y, jump: false, dt: null, heading: null });
  heading = random(360);
  lastT = millis();

  cam = createCapture(VIDEO, () => { camOK = true; });
  cam.size(320, 240);
  cam.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ---- deteccion de movimiento (igual que antes) ----
function medirMovimiento() {
  cam.loadPixels();
  const px = cam.pixels;
  if (!px || px.length === 0) return;

  const paso = 16;
  const n = Math.floor(px.length / paso);
  if (!prev || prev.length !== n) {
    prev = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      const i = k * paso;
      prev[k] = (px[i] + px[i + 1] + px[i + 2]) / 3;
    }
    return;
  }

  let suma = 0;
  for (let k = 0; k < n; k++) {
    const i = k * paso;
    const b = (px[i] + px[i + 1] + px[i + 2]) / 3;
    suma += Math.abs(b - prev[k]);
    prev[k] = b;
  }
  suave = 0.6 * suave + 0.4 * (suma / n);

  if (armado && suave > umbralAlto && millis() - ultDisparo > 400) {
    evento();
    ultDisparo = millis();
    armado = false;
  } else if (!armado && suave < umbralBajo()) {
    armado = true;
  }
}

function umbralBajo() { return Math.max(2, umbralAlto * 0.4); }

// ---- EL manejador: cada evento gira el rumbo ----
function evento() {
  const ahora = millis();
  const dt = (ahora - lastT) / 1000;

  let giro;
  if (modo === 1) {
    giro = 90 * (random() < 0.5 ? 1 : -1);         // angulo recto
  } else if (modo === 2) {
    giro = 45 * signoZig;                          // zigzag alterno
    signoZig *= -1;
  } else {
    giro = random(20, 160) * (random() < 0.5 ? 1 : -1); // aleatorio
  }
  heading = (heading + giro + 360) % 360;

  verts.push({ x: pos.x, y: pos.y, jump: false, dt: dt, heading: heading });
  lastT = ahora;
  nEventos++;
}

function draw() {
  background(paperC);
  if (camOK && cam.width > 0) medirMovimiento();

  // el lapiz avanza SIEMPRE: esto es el tiempo pasando
  const dtf = deltaTime / 1000;
  const H2 = height - HUD_H;
  pos.x += cos(heading) * SPEED * dtf;
  pos.y += sin(heading) * SPEED * dtf;

  // al salir por un borde reaparece por el opuesto (sin trazar la union)
  if (pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > H2) {
    verts.push({ x: constrain(pos.x, 0, width), y: constrain(pos.y, 0, H2),
                 jump: false, dt: null, heading: null });
    pos.x = (pos.x + width) % width;
    pos.y = (pos.y + H2) % H2;
    verts.push({ x: pos.x, y: pos.y, jump: true, dt: null, heading: null });
  }

  while (verts.length > MAXV) verts.shift();

  // el rastro
  stroke(inkC);
  strokeWeight(1.6);
  noFill();
  for (let i = 1; i < verts.length; i++) {
    if (!verts[i].jump) {
      line(verts[i - 1].x, verts[i - 1].y, verts[i].x, verts[i].y);
    }
  }
  const ult = verts[verts.length - 1];
  line(ult.x, ult.y, pos.x, pos.y);

  // un ojo en cada giro, mirando hacia la nueva direccion
  for (const v of verts) {
    if (v.dt !== null) ojoEnGiro(v);
  }

  // la punta del lapiz, con el tiempo de espera creciendo en vivo
  const el = (millis() - lastT) / 1000;
  noStroke();
  fill(accentC);
  circle(pos.x, pos.y, 7);
  fill(faintC);
  textAlign(LEFT, CENTER);
  text(nf(el, 0, 1) + ' s', pos.x + 10, pos.y);

  hud(el);
}

// ---- el ojo de almendra en un vertice de giro ----
function almendraCentrada(w, h) {
  beginShape();
  vertex(-w / 2, 0);
  quadraticVertex(0, -2 * h, w / 2, 0);
  quadraticVertex(0, 2 * h, -w / 2, 0);
  endShape(CLOSE);
}

function ojoEnGiro(v) {
  const w = constrain(10 + v.dt * 6, 10, 40);   // un poco mas grande si hubo espera
  const h = constrain(w * 0.36, 4, 15);

  push();
  translate(v.x, v.y);
  rotate(v.heading);
  noStroke();
  fill(scleraC);
  almendraCentrada(w, h);
  const r = h * 0.78;
  fill(colorIris(v.dt));  circle(0, 0, r * 2);
  fill(inkC);             circle(0, 0, r * 0.9);
  noFill();
  stroke(inkC);
  strokeWeight(1.3);
  almendraCentrada(w, h);
  pop();

  fill(faintC);
  noStroke();
  textAlign(CENTER, BASELINE);
  text(nf(v.dt, 0, 1) + ' s', v.x, v.y + h + 14);
}

function colorIris(dt) {
  const t = constrain(dt / MAXDT, 0, 1);
  colorMode(HSB, 360, 100, 100);
  const c = color(lerp(38, 205, t), 62, 72);    // ambar -> azul
  colorMode(RGB, 255);
  return c;
}

// ---- franja inferior: camara, medidor y estado ----
function hud(el) {
  const hy = height - HUD_H;
  stroke(red(inkC), green(inkC), blue(inkC), 40);
  line(24, hy, width - 24, hy);

  if (camOK && cam.width > 0) {
    push();
    translate(24 + 160, hy + 10);
    scale(-1, 1);
    image(cam, 0, 0, 160, 120);
    pop();
    noFill();
    stroke(inkC);
    strokeWeight(1);
    rect(24, hy + 10, 160, 120);

    const mx = 24 + 178, my = hy + 16, mw = 170;
    noStroke();
    fill(red(inkC), green(inkC), blue(inkC), 30);
    rect(mx, my, mw, 8, 4);
    fill(accentC);
    rect(mx, my, constrain(map(suave, 0, 25, 0, mw), 0, mw), 8, 4);
    const tx = mx + constrain(map(umbralAlto, 0, 25, 0, mw), 0, mw);
    stroke(inkC);
    line(tx, my - 3, tx, my + 11);

    fill(faintC);
    noStroke();
    textAlign(LEFT, BASELINE);
    text('movimiento — umbral ' + nf(umbralAlto, 0, 0) + '  (+ / -)', mx, my + 30);
    text(armado ? 'armado: el proximo movimiento gira el rumbo' : 'esperando calma para rearmar...', mx, my + 50);
  } else {
    fill(faintC);
    noStroke();
    textAlign(LEFT, BASELINE);
    text('Esperando la camara (acepta el permiso). Mientras, ESPACIO dispara eventos.', 24, hy + 34);
  }

  const nombres = { 1: 'angulo recto (90)', 2: 'zigzag (45)', 3: 'aleatorio' };
  fill(faintC);
  noStroke();
  textAlign(RIGHT, BASELINE);
  text(nEventos + ' eventos · giro: ' + nombres[modo] + '  (cambia con 1/2/3)', width - 24, hy + 26);
  text('desde el ultimo evento: ' + nf(el, 0, 1) + ' s', width - 24, hy + 46);
  text('ESPACIO evento manual · R borrar · S guardar PNG', width - 24, hy + 66);
}

// el teclado: otra fuente de eventos
function keyPressed() {
  if (key === ' ') {
    evento();
    return false;
  } else if (key === '1' || key === '2' || key === '3') {
    modo = int(key);
  } else if (key === 'r' || key === 'R') {
    verts = [];
    pos.set(width / 2, (height - HUD_H) / 2);
    heading = random(360);
    verts.push({ x: pos.x, y: pos.y, jump: false, dt: null, heading: null });
    lastT = millis();
    nEventos = 0;
  } else if (key === 's' || key === 'S') {
    saveCanvas('eventos-giros', 'png');
  } else if (key === '+' || key === '=') {
    umbralAlto = Math.min(40, umbralAlto + 1);
  } else if (key === '-') {
    umbralAlto = Math.max(3, umbralAlto - 1);
  }
}
