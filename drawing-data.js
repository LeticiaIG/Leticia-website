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
     process     → (opcional) blog del proceso: [{ title, date, image, text }]
   ═══════════════════════════════════════════════════════════ */

const DRAWING_COURSE = {
  title: 'Drawing ++',
  subtitle: 'Weekly sketches, experiments and notes from class.',
  term: 'Fall 2026'
};

const DRAWING_ENTRIES = [
  {
    id: 'week-01',
    title: 'Computational Concept with a Drawing',
    date: '2026-09-16',
    description:
      'Primera iteración. Una línea continua avanza sin parar. Cuando la cámara detecta movimiento, cambia de dirección.',
    instructions:
      'Allow camera access. <b>R</b> clear · <b>S</b> save PNG · <b>+ / −</b> sensitivity.',
    sketch: 'sketches/week-01/',
    process: [
      {
        title: 'First approach',
        date: '2026-09-16',
        image: 'Images/drawing/week-01-first-approach.jpg',
        text: 'Una línea continua avanza sin parar. Cuando la cámara detecta movimiento, cambia de dirección y dibuja un ojo: cuánto tiempo has estado mirando la línea antes de que gire.'
      }
    ]
  }

  // Semana siguiente: copia el bloque de arriba, pon una coma después de la } anterior
  // y usa, por ejemplo, sketch: 'sketches/week-02/'
];
