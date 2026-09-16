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
    // Iterations (v01, v02…). A plain `sketch` on the entry counts as one unlabeled iteration.
    const versions = (entry.versions && entry.versions.length)
      ? entry.versions
      : (entry.sketch ? [{ sketch: entry.sketch, code: entry.code, instructions: entry.instructions }] : []);

    const renderVersion = v => {
      const s = resolveSketch(v.sketch, v.code);
      const vlinks = [];
      if (s) {
        vlinks.push(`<a href="${esc(s.open)}" target="_blank" rel="noopener">Open full screen ↗</a>`);
        if (s.code) vlinks.push(`<a href="${esc(s.code)}" target="_blank" rel="noopener">View code ↗</a>`);
      }
      return `
      <div class="dr-version">
        ${v.label ? `<h3 class="dr-version-label">${esc(v.label)}</h3>` : ''}
        ${v.description ? `<div class="dr-panel-desc">${v.description}</div>` : ''}
        ${s ? `
        <div class="dr-frame">
          <iframe src="${esc(s.embed)}" title="${esc(entry.title)} ${esc(v.label || '')}" loading="lazy"
                  allow="fullscreen; camera; microphone; accelerometer; gyroscope"
                  allowfullscreen></iframe>
        </div>` : ''}
        ${v.instructions ? `<p class="dr-instructions">${v.instructions}</p>` : ''}
        ${vlinks.length ? `<div class="dr-links">${vlinks.join('')}</div>` : ''}
      </div>`;
    };

    const links = [];
    (entry.links || []).forEach(l => links.push(`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`));

    const prev = entries[index - 1];
    const next = entries[index + 1];

    panelEl.innerHTML = `
      <div class="dr-panel-head">
        <span class="dr-panel-num">${pad(index + 1)}</span>
        <div>
          <h2 class="dr-panel-title">${esc(entry.title)}</h2>
          ${entry.subtitle ? `<p class="dr-panel-subtitle">${esc(entry.subtitle)}</p>` : ''}
          ${entry.date ? `<p class="dr-panel-date">${formatDate(entry.date)}</p>` : ''}
        </div>
      </div>

      ${entry.description ? `<div class="dr-panel-desc">${entry.description}</div>` : ''}

      ${versions.map(renderVersion).join('')}

      ${links.length ? `<div class="dr-links">${links.join('')}</div>` : ''}

      ${(entry.images || []).length ? `
      <div class="dr-gallery">
        ${entry.images.map(src => `<a href="${esc(src)}" target="_blank"><img src="${esc(src)}" alt="" loading="lazy"></a>`).join('')}
      </div>` : ''}

      ${(entry.process || []).length ? `
      <section class="dr-process">
        <h3 class="dr-process-head">Process</h3>
        ${entry.process.map(post => `
        <div class="dr-post">
          ${post.title || post.date ? `
          <div class="dr-post-meta">
            ${post.title ? `<span class="dr-post-title">${esc(post.title)}</span>` : ''}
            ${post.date ? `<span class="dr-post-date">${formatDate(post.date)}</span>` : ''}
          </div>` : ''}
          ${post.image ? `<a href="${esc(post.image)}" target="_blank"><img class="dr-post-img" src="${esc(post.image)}" alt="${esc(post.title)}" loading="lazy"></a>` : ''}
          ${post.text ? `<p class="dr-post-text">${post.text}</p>` : ''}
        </div>`).join('')}
      </section>` : ''}

      <section class="dr-feedback">
        <h3 class="dr-process-head">Feedback</h3>
        <form class="dr-feedback-form">
          <input class="dr-fb-name" type="text" placeholder="Name (optional)">
          <textarea class="dr-fb-text" rows="4" placeholder="Leave your feedback…" required></textarea>
          <button type="submit">Send feedback</button>
        </form>
      </section>

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

  // Feedback box: opens an email with the message
  panelEl.addEventListener('submit', e => {
    const form = e.target.closest && e.target.closest('.dr-feedback-form');
    if (!form) return;
    e.preventDefault();
    const text = form.querySelector('.dr-fb-text').value.trim();
    if (!text) return;
    const name = form.querySelector('.dr-fb-name').value.trim();
    const title = (document.querySelector('.dr-panel-title') || {}).textContent || 'Drawing ++';
    const subject = `Drawing ++ feedback — ${title}`;
    const body = text + (name ? `\n\n— ${name}` : '');
    window.location.href = `mailto:${course.feedbackEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  window.addEventListener('hashchange', route);
  route();
})();
