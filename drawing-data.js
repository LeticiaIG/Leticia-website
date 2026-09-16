/* ═══════════════════════════════════════════════════════════
   DRAWING ++  —  contenido de la clase
   ───────────────────────────────────────────────────────────
   Para añadir una semana nueva: copia un bloque { ... } de
   abajo, pégalo al final de la lista y cambia los datos.
   El número (01, 02, 03…) se pone solo según el orden.

   Campos:
     id          → identificador corto, sin espacios (sale en la URL: drawing.html#week-03)
     title       → título de la pestaña
     date        → fecha 'AAAA-MM-DD' (opcional)
     description → texto (puedes usar <b>, <i>, <a href="">, <br>)
     instructions→ (opcional) instrucciones de uso que salen debajo del dibujo
     sketch      → (opcional) enlace a tu sketch. Acepta:
                     · https://p5js.org/sketches/2213463/
                     · https://openprocessing.org/sketch/2213463
                     · https://editor.p5js.org/usuario/sketches/AbCdEf
                     · una carpeta del repo: 'sketches/week-02/'
     code        → (opcional) enlace al código si es distinto del sketch
     images      → (opcional) lista de imágenes: ['Images/drawing/w1-a.png', ...]
     links       → (opcional) lista de enlaces: [{ label: 'Referencia', url: 'https://...' }]
   ═══════════════════════════════════════════════════════════ */

const DRAWING_COURSE = {
  title: 'Drawing ++',
  subtitle: 'Weekly sketches, experiments and notes from class.',
  term: 'Fall 2026'
};

const DRAWING_ENTRIES = [
  {
    id: 'week-01',
    title: 'EventosGiros',
    date: '2026-09-16',
    description:
      'Un dibujo dirigido por eventos. Un lápiz avanza siempre a velocidad constante: el tiempo hecho visible. ' +
      'Cada vez que la cámara detecta movimiento se dispara un evento que gira el rumbo del lápiz, así que cada tramo recto ' +
      'mide el tiempo entre dos eventos. En cada giro queda un ojo mirando hacia la nueva dirección ' +
      '(iris ámbar = eventos seguidos, azul = hubo que esperar).',
    instructions:
      'Acepta el permiso de cámara y haz clic sobre el dibujo para usar el teclado: ' +
      '<b>ESPACIO</b> evento manual · <b>1 / 2 / 3</b> tipo de giro · <b>R</b> borrar · <b>S</b> guardar PNG · <b>+ / −</b> sensibilidad.',
    sketch: 'sketches/week-01/'
  }

  // Semana siguiente: copia el bloque de arriba, pon una coma después de la } anterior
  // y usa, por ejemplo, sketch: 'sketches/week-02/'
];
