// Drawing ++ — renders the weekly tabs from drawing-data.js

(function () {
  const entries = (typeof DRAWING_ENTRIES !== 'undefined') ? DRAWING_ENTRIES : [];
  const course = (typeof DRAWING_COURSE !== 'undefined') ? DRAWING_COURSE : {};

  const tabsEl = document.getElementById('dr-tabs');
  const panelEl = document.getElementById('dr-panel');

  document.getElementById('dr-title').textContent = course.title || 'Drawing ++';
  document.getElementById('dr-subtitle').textContent = course.subtitle || '';
  document.getElementById('dr-term').textContent = course.term || '';

  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Turn any supported sketch link into { embed, open, code }
  function resolveSketch(url, codeUrl) {
    if (!url) return null;
    let m;
    if ((m = url.match(/p5js\.org\/sketches\/(\d+)/)) || (m = url.match(/openprocessing\.org\/sketch\/(\d+)/))) {
      const id = m[1];
      return {
        embed: `https://openprocessing.org/sketch/${id}/embed/?plusEmbedFullscreen=true&plusEmbedInstructions=false`,
        open: url,
        code: codeUrl || `https://openprocessing.org/sketch/${id}#code`
      };
    }
    if ((m = url.match(/editor\.p5js\.org\/([^/]+)\/(?:sketches|full|present)\/([^/?#]+)/))) {
      return {
        embed: `https://editor.p5js.org/${m[1]}/full/${m[2]}`,
        open: `https://editor.p5js.org/${m[1]}/full/${m[2]}`,
        code: codeUrl || `https://editor.p5js.org/${m[1]}/sketches/${m[2]}`
      };
    }
    if (!/^https?:/.test(url)) {
      const base = url.endsWith('/') ? url : url + '/';
      return { embed: base, open: base, code: codeUrl || base + 'sketch.js' };
    }
    return { embed: url, open: url, code: codeUrl || null };
  }

  function formatDate(d) {
    if (!d) return '';
    const date = new Date(d + 'T12:00:00');
    if (isNaN(date)) return esc(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderTabs(activeId) {
    tabsEl.innerHTML = entries.map((e, i) => `
      <li>
        <a href="#${esc(e.id)}" class="dr-tab${e.id === activeId ? ' is-active' : ''}">
          <span class="dr-tab-num">${pad(i + 1)}</span>
          <span class="dr-tab-title">${esc(e.title)}</span>
        </a>
      </li>`).join('');
  }

  function renderPanel(entry, index) {
    if (!entry) {
      panelEl.innerHTML = '<p class="dr-empty">No entries yet — add one in <code>drawing-data.js</code>.</p>';
      return;
    }
    const s = resolveSketch(entry.sketch, entry.code);
    const links = [];
    if (s) {
      links.push(`<a href="${esc(s.open)}" target="_blank" rel="noopener">Open full screen ↗</a>`);
      if (s.code) links.push(`<a href="${esc(s.code)}" target="_blank" rel="noopener">View code ↗</a>`);
    }
    (entry.links || []).forEach(l => links.push(`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`));

    const prev = entries[index - 1];
    const next = entries[index + 1];

    panelEl.innerHTML = `
      <div class="dr-panel-head">
        <span class="dr-panel-num">${pad(index + 1)}</span>
        <div>
          <h2 class="dr-panel-title">${esc(entry.title)}</h2>
          ${entry.date ? `<p class="dr-panel-date">${formatDate(entry.date)}</p>` : ''}
        </div>
      </div>

      ${entry.description ? `<div class="dr-panel-desc">${entry.description}</div>` : ''}

      ${s ? `
      <div class="dr-frame">
        <iframe src="${esc(s.embed)}" title="${esc(entry.title)}" loading="lazy"
                allow="fullscreen; camera; microphone; accelerometer; gyroscope"
                allowfullscreen></iframe>
      </div>
      ${entry.instructions ? `<p class="dr-instructions">${entry.instructions}</p>` : ''}` : ''}

      ${(entry.images || []).length ? `
      <div class="dr-gallery">
        ${entry.images.map(src => `<a href="${esc(src)}" target="_blank"><img src="${esc(src)}" alt="" loading="lazy"></a>`).join('')}
      </div>` : ''}

      ${links.length ? `<div class="dr-links">${links.join('')}</div>` : ''}

      <nav class="dr-pager">
        ${prev ? `<a href="#${esc(prev.id)}">← ${pad(index)} ${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a href="#${esc(next.id)}">${pad(index + 2)} ${esc(next.title)} →</a>` : '<span></span>'}
      </nav>`;
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    let index = entries.findIndex(e => e.id === id);
    if (index < 0) index = entries.length - 1; // default: latest week
    const entry = entries[index];
    renderTabs(entry && entry.id);
    renderPanel(entry, index);
    if (id) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Give keyboard focus to the sketch when the pointer enters it
  panelEl.addEventListener('mouseover', e => {
    const f = e.target.closest && e.target.closest('.dr-frame');
    if (f) { const ifr = f.querySelector('iframe'); try { ifr.contentWindow.focus(); } catch (_) {} }
  });

  window.addEventListener('hashchange', route);
  route();
})();
