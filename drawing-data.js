/* ═══════════════════════════════════════════════════════════
   DRAWING ++  —  contenido de la clase
   ───────────────────────────────────────────────────────────
   Para añadir una semana nueva: copia un bloque { ... } de
   abajo, pégalo al final de la lista y cambia los datos.
   El número (01, 02, 03…) se pone solo según el orden.

   Campos:
     id          → identificador corto, sin espacios (sale en la URL: drawing.html#week-03)
     title       → título de la pestaña
     subtitle    → (opcional) texto debajo del título (p. ej. 'Events')
     versions    → (opcional) iteraciones: [{ label: 'v01', sketch, instructions, description }]
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
  subtitle: 'Weekly sketches, experiments and notes.',
  term: 'Fall 2026',
  feedbackEmail: 'leticiai@mit.edu'   // where the Feedback box sends messages
};

const DRAWING_ENTRIES = [
  {
    id: 'week-01',
    title: 'Computational Concept in a Drawing',
    subtitle: 'Events',
    description:
      'First iteration. A continuous line keeps moving forward. When the camera detects movement, it changes direction.',
    versions: [
      {
        label: 'v01',
        sketch: 'sketches/week-01/v01/',
        instructions:
          'Allow camera access and click on the drawing to use the keyboard: ' +
          '<b>SPACE</b> manual event · <b>1 / 2 / 3</b> turn type · <b>R</b> clear · <b>S</b> save PNG · <b>+ / −</b> sensitivity.'
      }
      // Next iteration: add a comma after the } above and copy the block, e.g.
      // { label: 'v02', sketch: 'sketches/week-01/v02/', instructions: '...' }
    ],
    process: [
      { image: 'Images/drawing/week-01-first-approach.jpg' }
    ]
  }

  // Next week: add a comma after the } above and copy the whole block.
];
