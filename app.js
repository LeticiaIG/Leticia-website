// Translations
const translations = {
  en: {
    work: 'Works',
    talks: 'Talks',
    publications: 'Publications',
    blog: 'Blog',
    about: 'About',
    selectedWorks: 'Selected Works',
    talksWorkshops: 'Talks & Workshops',
    moreInWorks: 'More in Works ›',
    moreInTalks: 'More in Talks ›',
    moreInPubs: 'More in Publications ›',
    moreInMedia: 'More in Media ›',
    latest: 'Highlights',
    archive: 'Archive',
    education: 'Education',
    experience: 'Experience',
    awards: 'Awards',
    getInTouch: 'Get in touch →',
    bioTagline: 'Available for talks, collaborations and consulting.',
    bioSecondary: "Born in Madrid, trained as an architect and computational designer at UPM — Polytechnic University of Madrid. Spent years working on how technology can make cities more human. I model how people perceive, navigate, and feel cities and spaces—then feed that back into design tools and digital simulations. Now a PhD researcher at MIT Media Lab's City Science group.",
    roles: ['Urban Researcher', 'Computational Designer', 'PhD Candidate', 'Architect', 'City Scientist']
  },
  es: {
    work: 'Trabajos',
    talks: 'Charlas',
    publications: 'Publicaciones',
    blog: 'Blog',
    about: 'Sobre mí',
    selectedWorks: 'Trabajos Seleccionados',
    talksWorkshops: 'Charlas & Talleres',
    moreInWorks: 'Más trabajos ›',
    moreInTalks: 'Más charlas ›',
    moreInPubs: 'Más publicaciones ›',
    moreInMedia: 'Más medios ›',
    latest: 'Recientes',
    archive: 'Archivo',
    education: 'Educación',
    experience: 'Experiencia',
    awards: 'Premios',
    getInTouch: 'Contactar →',
    bioTagline: 'Disponible para charlas, colaboraciones y consultoría.',
    bioSecondary: 'Nacida en Madrid, formada como arquitecta y diseñadora computacional en la UPM — Universidad Politécnica de Madrid. Años trabajando en cómo la tecnología puede hacer las ciudades más humanas. Modelo cómo las personas perciben, navegan y sienten ciudades y edificios—y lo integro en herramientas de diseño y simulaciones digitales. Ahora investigadora doctoral en el MIT Media Lab, grupo City Science.',
    roles: ['Investigadora Urbana', 'Diseñadora Computacional', 'Doctoranda', 'Arquitecta', 'City Scientist']
  }
};

let currentLang = 'en';

function switchLanguage() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  const t = translations[currentLang];
  
  // Update nav
  document.querySelector('a[href="#works"]').textContent = t.work;
  document.querySelector('a[href="#blog"]').textContent = t.blog;
  document.querySelector('a[href="#publications"]').textContent = t.publications;
  document.querySelector('a[href="#about"]').textContent = t.about;
  document.getElementById('lang-switch').textContent = currentLang === 'en' ? 'ES' : 'EN';
  
  // Update section headers
  const blogH2 = document.querySelector('#blog h2');
  const pubsH2 = document.querySelector('#publications h2');
  if (blogH2) blogH2.textContent = t.blog;
  if (pubsH2) pubsH2.textContent = t.publications;
  
  // Update more links
  const worksMore = document.querySelector('#works .more-link');
  const pubsMore = document.querySelector('#publications .more-link');
  const mediaMore = document.querySelector('#media .more-link');
  if (worksMore) worksMore.textContent = t.moreInWorks;
  if (pubsMore) pubsMore.textContent = t.moreInPubs;
  if (mediaMore) mediaMore.textContent = t.moreInMedia;
  
  // Update media tabs
  const tabs = document.querySelectorAll('.media-tab');
  if (tabs[0]) tabs[0].textContent = t.latest;
  if (tabs[1]) tabs[1].textContent = t.archive;
  
  // Update about section
  document.querySelector('.bio-tagline').textContent = t.bioTagline;
  document.querySelector('.bio-secondary').textContent = t.bioSecondary;
  document.querySelector('.contact-btn').textContent = t.getInTouch;
  
  // Update about grid headers
  const aboutHeaders = document.querySelectorAll('.about-grid h3');
  if (aboutHeaders[0]) aboutHeaders[0].textContent = t.education;
  if (aboutHeaders[1]) aboutHeaders[1].textContent = t.experience;
  if (aboutHeaders[2]) aboutHeaders[2].textContent = t.awards;
  
  // Update rotating roles
  window.currentRoles = t.roles;
}

// Hero Slider functionality
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initHeaderScroll();
  initRotatingRole();
  initCVToggle();
  
  // Language switch
  document.getElementById('lang-switch').addEventListener('click', (e) => {
    e.preventDefault();
    switchLanguage();
  });
});

// CV Toggle functionality
function initCVToggle() {
  const toggle = document.getElementById('cv-toggle');
  const content = document.getElementById('cv-content');
  
  if (!toggle || !content) return;
  
  toggle.addEventListener('click', () => {
    const isOpening = !content.classList.contains('open');
    toggle.classList.toggle('active');
    content.classList.toggle('open');

    if (isOpening) {
      // Wait for the CSS expand transition, then scroll into view
      setTimeout(() => {
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  });
}

// Rotating role text in About section and intro slide
function initRotatingRole() {
  const roleElement = document.getElementById('rotating-role');
  const roleElementSlide = document.getElementById('rotating-role-slide');
  
  if (!roleElement && !roleElementSlide) return;
  
  window.currentRoles = translations[currentLang].roles;
  let currentIndex = 0;
  
  setInterval(() => {
    // Fade out both elements
    if (roleElement) roleElement.classList.add('fade');
    if (roleElementSlide) roleElementSlide.classList.add('fade');
    
    setTimeout(() => {
      const roles = window.currentRoles || translations[currentLang].roles;
      currentIndex = (currentIndex + 1) % roles.length;
      
      // Update both elements
      if (roleElement) {
        roleElement.textContent = roles[currentIndex];
        roleElement.classList.remove('fade');
      }
      if (roleElementSlide) {
        roleElementSlide.textContent = roles[currentIndex];
        roleElementSlide.classList.remove('fade');
      }
    }, 300);
  }, 3000);
}

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let autoSlideInterval;
  let isFrozen = false; // Track if slider is frozen on About slide
  const AUTO_SLIDE_DELAY = 5000; // 5 seconds
  const LAST_SLIDE_INDEX = slides.length - 1; // About slide
  
  function goToSlide(index) {
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = index;
    
    // Handle wrapping (but not if going to last slide)
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Freeze on last slide (About)
    if (currentSlide === LAST_SLIDE_INDEX) {
      stopAutoSlide();
      isFrozen = true;
    }
  }
  
  function nextSlide() {
    // Don't auto-advance past the last slide
    if (currentSlide === LAST_SLIDE_INDEX) {
      stopAutoSlide();
      isFrozen = true;
      return;
    }
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  function startAutoSlide() {
    if (isFrozen) return; // Don't restart if frozen
    autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  function resetAutoSlide() {
    stopAutoSlide();
    // Only restart auto-slide if not on last slide
    if (currentSlide !== LAST_SLIDE_INDEX) {
      isFrozen = false;
      startAutoSlide();
    }
  }
  
  // Arrow navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // If frozen on last slide, go to first slide
      if (isFrozen && currentSlide === LAST_SLIDE_INDEX) {
        isFrozen = false;
        goToSlide(0);
        startAutoSlide();
      } else {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
      }
    });
  }
  
  // Indicator navigation
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide();
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoSlide();
    }
  });
  
  // Start auto-slide
  startAutoSlide();
  
  // Pause on hover
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }
}

// Header scroll effect + Active nav highlighting
function initHeaderScroll() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    // Header background
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active section highlighting
    let currentSection = '';
    const scrollPos = window.scrollY + 150; // Offset for header
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

// Cargar y renderizar datos del CV
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, starting data fetch...');
  
  try {
    // Cargar datos principales primero (crítico)
  const data = await loadCVData();
    console.log('CV data loaded:', data ? 'success' : 'failed');

  if (data) {
      console.log('Works:', data.works?.length, 'Talks:', data.talks?.length, 'Media:', data.media?.length);
      // Hero - cargar imagen/video
      renderHeroMedia(data);
      if (data.works?.length) {
        renderWorksStory(data.works);
      }
      // Research - card grid
      renderResearchList(data.publications || []);
      // Activity - bento + compact mentions
      renderActivitySection(data.media || [], data.awards || [], data.talks || []);
      // Upcoming events
      renderUpcoming(data.upcoming || []);
      if (data.about) renderAbout(data.about);
    } else {
      console.error('No data received from Google Sheets');
      // Load demo data as fallback
      loadDemoData();
    }
    
    // Cargar socials de forma separada (no crítico)
    try {
      const socials = await loadSocialsData();
      if (socials) {
        updateSocialLinks(socials);
      }
    } catch (e) {
      console.warn('Could not load socials:', e);
    }
  } catch (error) {
    console.error('Error loading CV data:', error);
    console.log('Loading demo data as fallback...');
    loadDemoData();
  }
});

// Actualizar enlaces de redes sociales dinámicamente
function updateSocialLinks(socials) {
  // Si no hay datos de socials válidos, no hacer nada
  if (!socials || Object.keys(socials).length === 0 || Object.values(socials).every(v => !v)) {
    console.log('No social links data available, keeping default links');
    return;
  }
  
  // Formatear WhatsApp (agregar prefijo si es necesario)
  const whatsappNum = socials.whatsapp || socials.telefono;
  const whatsappLink = whatsappNum ? `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}` : null;
  
  // Mapeo de plataformas a sus enlaces
  const links = {
    linkedin: socials.linkedin || socials.linkedIn,
    instagram: socials.instagram || socials.instragram, // typo common
    scholar: socials['google scholar'] || socials.googlescholar || socials.scholar,
    whatsapp: whatsappLink,
    email: socials.email ? `mailto:${socials.email}` : null
  };
  
  // Actualizar botón flotante de WhatsApp
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn && links.whatsapp) {
    whatsappBtn.href = links.whatsapp;
  }
  
  // Actualizar enlaces en About section
  const aboutSocial = document.querySelector('.about-social');
  if (aboutSocial && Object.values(links).some(v => v)) {
    aboutSocial.innerHTML = `
      ${links.linkedin ? `<a href="${links.linkedin}" target="_blank">LinkedIn</a>` : ''}
      ${links.instagram ? `<a href="${links.instagram}" target="_blank">Instagram</a>` : ''}
      ${links.scholar ? `<a href="${links.scholar}" target="_blank">Scholar</a>` : ''}
      ${links.whatsapp ? `<a href="${links.whatsapp}" target="_blank">WhatsApp</a>` : ''}
    `;
  }
  
  // Actualizar enlaces en Footer
  const footerSocial = document.querySelector('footer .social-links');
  if (footerSocial && Object.values(links).some(v => v)) {
    footerSocial.innerHTML = `
      ${links.linkedin ? `<a href="${links.linkedin}" target="_blank">LinkedIn</a>` : ''}
      ${links.instagram ? `<a href="${links.instagram}" target="_blank">Instagram</a>` : ''}
      ${links.scholar ? `<a href="${links.scholar}" target="_blank">Google Scholar</a>` : ''}
      ${links.whatsapp ? `<a href="${links.whatsapp}" target="_blank">WhatsApp</a>` : ''}
      <a href="mailto:leticiai@mit.edu">Email</a>
    `;
  }
  
  // Solo mostrar el log si hay enlaces válidos
  const hasValidLinks = Object.values(links).some(v => v);
  if (hasValidLinks) {
    console.log('Social links loaded:', links);
  }
}

// MIT Media Lab style - smart grid filling with paired cards

// Archived works - only shown when "More" is clicked
const ARCHIVED_WORKS = [
  'ORILUM',
  'Kinetic Origami',
  'Immersive Scope',
  'HairIO',
];

// Featured works - most impactful urban planning & design projects
const FEATURED_WORKS = [
  'Ghaf Woods',
  'Canopy',
  'Carbon',
  'Neighborhood-Scale',
  'Urban AI',
  'Zoning',
  'Autonomous Mobility',
  'PIX Moving',
  'Gastronomy',
  'Affordable Housing',
  'Climate',
  'Generative',
  'City Science',
  'Smart City',
  'Data-Driven'
];

// ======================================
// WORKS GRID RENDER (Asymmetric Grid)
// ======================================
function renderWorksStory(works) {
  const container = document.getElementById('works-grid');
  if (!container) {
    console.log('works-grid container not found');
    return;
  }
  
  console.log('Total works received:', works.length);
  
  // Filtrar por columna Website si existe
  let projectsToShow = works.filter(work => {
    const hasWebsiteMark = work.Website === 'X' || work.website === 'x' || work.Website === 'x' || work.website === 'X';
    const hasWebsiteColumn = work.Website !== undefined || work.website !== undefined;
    const shouldShow = hasWebsiteColumn ? hasWebsiteMark : true;
    const hasImage = work.image && !work.image.includes('placeholder');
    const isArchived = ARCHIVED_WORKS.some(aw => work.title?.includes(aw));
    // Exclude hero/intro type entries
    const isHeroEntry = work.type === 'Hero' || work.type === 'hero';
    return shouldShow && hasImage && !isArchived && !isHeroEntry;
  });

  // ── Merge Madrid Nuevo Norte + Madrid 2050 into one card ──
  const madridNorteIdx = projectsToShow.findIndex(w =>
    w.title?.toLowerCase().includes('nuevo norte') ||
    w.title?.toLowerCase().includes('madrid nuevo')
  );
  const madrid2050Idx = projectsToShow.findIndex(w =>
    w.title?.toLowerCase().includes('madrid 2050') ||
    w.title?.toLowerCase().includes('¿cómo viviremos')
  );
  if (madridNorteIdx !== -1 && madrid2050Idx !== -1) {
    const mn  = projectsToShow[madridNorteIdx];
    const m50 = projectsToShow[madrid2050Idx];
    const merged = {
      ...m50,
      title: 'Madrid 2050 & Nuevo Norte',
      description: 'Strategic vision for Madrid\'s carbon-neutral future, combining the Madrid 2050 masterplan with the participatory assessment of the Madrid Nuevo Norte urban regeneration district.',
      image: m50.image || mn.image,
      location: 'Madrid, ES',
    };
    const toRemove = new Set([madridNorteIdx, madrid2050Idx]);
    projectsToShow = projectsToShow.filter((_, i) => !toRemove.has(i));
    projectsToShow.push(merged);
  } else if (madridNorteIdx !== -1 && madrid2050Idx === -1) {
    // Only Nuevo Norte exists — rename it
    projectsToShow[madridNorteIdx].title = 'Madrid 2050 & Nuevo Norte';
  }

  console.log('Projects to show:', projectsToShow.length);

  if (projectsToShow.length === 0) {
    container.innerHTML = '<div style="padding:4rem;text-align:center;color:#999">Loading projects...</div>';
    return;
  }

  const INITIAL_PROJECTS = 3;
  const hasMore = projectsToShow.length > INITIAL_PROJECTS;

  const renderCard = (work, index) => {
    const isFirst = index === 0;
    const isHidden = index >= INITIAL_PROJECTS ? 'hidden-project' : '';
    const imgUrl = work.image || '';
    const delay = index * 0.08;
    return `
      <div class="project-card ${isFirst ? 'project-card--featured' : ''} ${isHidden}"
           style="background-image:url('${imgUrl}'); animation-delay:${delay}s">
        <div class="project-card-overlay"></div>
        <div class="project-card-content">
          <span class="project-tag">${work.year} · ${work.type || 'Project'}</span>
          <div class="project-name">${work.title}</div>
          <p class="project-desc">${work.description || ''}</p>
          ${work.location ? `<p class="project-location">${work.location}</p>` : ''}
        </div>
        ${work.link ? `<a href="${work.link}" target="_blank" class="project-arrow">↗</a>` : ''}
      </div>
    `;
  };

  container.innerHTML = projectsToShow.map((w, i) => renderCard(w, i)).join('');

  // View all button
  const btn = document.getElementById('view-all-projects-btn');
  if (btn) {
    if (hasMore) {
      btn.style.display = 'inline-flex';
      btn.textContent = 'View more →';
      btn.addEventListener('click', () => {
        const isExpanded = btn.dataset.expanded === 'true';

        if (!isExpanded) {
          // Show all hidden projects
          const hidden = container.querySelectorAll('.hidden-project');
          hidden.forEach((el, i) => {
            el.classList.remove('hidden-project');
            el.style.animationDelay = `${i * 0.07}s`;
            el.style.animation = 'cardFadeUp 0.5s ease forwards';
          });
          btn.textContent = '← See less';
          btn.dataset.expanded = 'true';
        } else {
          // Hide projects beyond INITIAL_PROJECTS again
          const allCards = container.querySelectorAll('.project-card');
          allCards.forEach((el, i) => {
            if (i >= INITIAL_PROJECTS) {
              el.classList.add('hidden-project');
              el.style.animation = '';
            }
          });
          btn.textContent = 'View more →';
          btn.dataset.expanded = 'false';
          // Scroll back up to the works section
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      btn.style.display = 'none';
    }
  }
}

// ======================================
// DEMO DATA FALLBACK
// ======================================
function loadDemoData() {
  console.log('Loading demo data...');
  
  const demoData = {
    works: [
      { year: 2026, type: 'Hero', title: 'Hero Image', image: 'Images/hero-bg.mp4', Website: 'X' },
      // 1 — Featured (large card)
      { year: 2025, type: 'Project', title: 'Ghaf Woods Experience Centre', description: 'Award-winning biophilic urban ecosystem design with native Ghaf trees integrating sustainable forest living in Dubai.', location: 'Dubai, AE', image: 'Images/Ghafs.jpg', link: '', Website: 'X' },
      // 2 — Generative Experiences
      { year: 2025, type: 'Project', title: 'Generative Experiences: LLM Agent-Based Modeling and Citizen Narratives to Rehearse Urban Futures', description: 'A simulation platform for human behavior.', location: 'San Francisco, US', image: 'Images/SF.png', link: '', Website: 'X' },
      // 3 — Spirit Animals / Animal Robots
      { year: 2026, type: 'Project', title: 'Spirit Animals: Building animal-like robots as companions for cities to come', description: 'Designing companions for the city.', location: 'Boston, US', image: 'Images/spirit-animals.png', link: '', Website: 'X' },
      // 4 — Madrid (merged)
      { year: 2026, type: 'Project', title: 'Madrid 2050 & Nuevo Norte', description: 'Strategic vision for Madrid\'s carbon-neutral future, combining the Madrid 2050 masterplan with the participatory assessment of the Madrid Nuevo Norte urban regeneration district.', location: 'Madrid, ES', image: 'Images/Canopy.jpg', link: '', Website: 'X' },
      // 5 — PIX
      { year: 2019, type: 'Project', title: 'PIX: Rebuild the City with Autonomous Mobility', description: 'Self-driving mobility initiative exploring how autonomous vehicles can reshape urban infrastructure and public space.', location: 'Guiyang, CN', image: 'Images/PIX.png', link: '', Website: 'X' },
      // — Additional projects (revealed on "View all") —
      { year: 2024, type: 'Project', title: 'Canopy: Urban Forestry & Biophilic Infrastructure', description: 'Parametric canopy system that integrates native tree species into urban street grids to reduce heat islands and improve air quality.', location: 'Boston, US', image: 'Images/Canopy.jpg', link: '', Website: 'X' },
      { year: 2024, type: 'Project', title: 'Neighborhood-Scale Carbon Emissions Impact', description: 'Interactive tool engaging residents in measuring and visualizing community-level carbon footprints to drive behavioral and policy change.', location: 'New York, US', image: 'Images/20241116_NAHM_AM_146.png', link: '', Website: 'X' },
      { year: 2023, type: 'Project', title: 'Gastronomy, Territory & Sustainability', description: 'Mapping the relationship between food systems, land use, and cultural identity across Spanish cities.', location: 'Spain', image: 'Images/gastronomy.png', link: '', Website: 'X' },
      { year: 2023, type: 'Project', title: 'Becoming Cities: Adaptive Urbanism in Transition Zones', description: 'Research and exhibition exploring how informal settlements evolve into formal urban fabrics in Latin American cities.', location: 'Biennale', image: 'Images/bienale.jpg', link: '', Website: 'X' },
      { year: 2022, type: 'Project', title: 'Affordable Housing: Norman Foster Foundation Workshop', description: 'Interdisciplinary workshop co-designing scalable affordable housing strategies for post-pandemic Mediterranean cities.', location: 'Madrid, ES', image: 'Images/Cities NFF.png', link: 'https://d1f6o4licw9har.cloudfront.net/flip/NFF22/54/index.html', Website: 'X' },
    ],
    publications: [
      { year: 2026, title: 'Comparative assessment of women\'s safety and mobility research methods in informal neighborhoods', journal: 'Nature NPJ Urban Sustainability', link: 'https://www.nature.com/articles/s42949-026-00358-5', image: 'Images/20241116_NAHM_AM_146.png', Website: 'X' },
      { year: 2025, title: 'Generative Agents in Agent-Based Modeling: Overview, Validation, and Emerging Challenges', journal: 'ACM DIS', link: '', image: 'Images/SF.png', Website: 'X' },
      { year: 2025, title: 'Neighborhood-Scale Carbon Emissions Impact: Engaging Visitors in Urban Sustainability', journal: 'Interactions 32 (6)', link: '', image: 'Images/20241116_NAHM_AM_146.png', Website: 'X' },
      { year: 2024, title: 'An agent-based model to evaluate the perception of safety', journal: 'Journal of Urban Planning and Development', link: '', image: 'Images/climate-newyork.png', Website: 'X' },
      { year: 2022, title: 'Cities: Affordable Housing Workshop', journal: 'Norman Foster Foundation', link: 'https://d1f6o4licw9har.cloudfront.net/flip/NFF22/54/index.html', image: 'Images/Cities NFF.png', Website: 'X' },
      { year: 2026, title: 'The challenges, methods, and opportunities of understanding informal urbanism: a case study in Lomas del Centinela, Mexico', journal: 'Nature NPJ Urban Sustainability', link: 'https://www.nature.com/articles/s42949-026-00360-x', image: 'Images/Canopy.jpg', Website: 'X' },
    ],
    talks: [
      // TEDx → hero card (image + most recognisable brand)
      { year: 2024, title: 'Transforming Cities: AI for a Human-Centered Future', institution: 'TEDxBoston: Countdown to AGI', link: 'https://www.media.mit.edu/events/tedxboston-countdown-to-artificial-general-intelligence/', image: 'Images/SF-talk.png', Website: 'X' },
      // Compact mentions
      { year: 2025, title: 'Community Carbon Impact Calculator', institution: 'NYC Climate Week', link: '', image: '', Website: 'X' },
      { year: 2025, title: 'Madrid 2050: Design Future Thinking', institution: 'COAM International Forum', link: 'https://www.instagram.com/letici.ai/p/DR0HbbfkSEr/', image: '', Website: 'X' },
      { year: 2025, title: 'Urban Biometrics Workshop', institution: 'MIT & Shanghai', link: '', image: '', Website: 'X' },
    ],
    media: [
      // El País → right-bottom card (international press, strong image)
      { year: 2025, title: 'The goat brigade that stops raging forest fires in Chile', outlet: 'El País (International Edition)', link: 'https://english.elpais.com/international/2025-07-26/the-goat-brigade-that-stops-raging-forest-fires-in-chile.html', image: 'Images/b82325fe-d869-4f90-8dd8-886df91a5f4e.png', Website: 'X' },
      // Compact mentions
      { year: 2024, title: 'Efficient doesn\'t always mean livable', outlet: 'Business Insider', link: 'https://www.businessinsider.es/tecnologia/espanola-investiga-mit-ia-disenar-mejores-ciudades-1242606', image: '', Website: 'X' },
    ],
    awards: [
      // Ghaf Woods → right-top card (2026 prize, strong image)
      { year: 2026, title: 'First Prize Ghaf Wood Competition', institution: 'METAMAT Ghaf Woods Development', image: 'Images/Ghafs.jpg', Website: 'X' },
      // Compact mentions
      { year: 2023, title: 'Holcim Scholarship Fellow', institution: 'Holcim Foundation', image: '', Website: 'X' },
      { year: 2022, title: 'La Caixa Postgraduate Fellowship', institution: 'La Caixa Foundation', image: '', Website: 'X' },
    ],
    upcoming: [
      { year: 2026, type: 'Talk', title: 'Human Experience in Current and Future Cities', institution: 'Norman Foster Institute', Upcoming: 'X' },
      { year: 2026, type: 'Publication', title: 'AI-Assisted Visioning Expands Civic Agency', institution: 'MIT', Upcoming: 'X' },
      { year: 2026, type: 'Publication', title: 'DIS', institution: 'DIS Conference', Upcoming: 'X' },
    ],
    about: {
      education: [],
      experience: []
    }
  };
  
  // Render with demo data
  renderHeroMedia(demoData); // Hero image/video
  if (demoData.works?.length) {
    renderWorksStory(demoData.works);
  }
  renderResearchList(demoData.publications || []);
  renderActivitySection(demoData.media || [], demoData.awards || [], demoData.talks || []);
  renderUpcoming(demoData.upcoming || []);
}

function renderWorks(works) {
  const container = document.getElementById('works-grid');
  if (!container) return;
  
  // Filter out featured projects that are already in story format
  const nonFeaturedWorks = works.filter(work => {
    const isFeatured = FEATURED_WORKS.some(fw => work.title?.includes(fw));
    const hasImage = work.image && !work.image.includes('placeholder');
    return !(isFeatured && hasImage); // Exclude featured projects with images
  });
  
  // Sort: archived last, then by year, then by having image
  nonFeaturedWorks.sort((a, b) => {
    const aFeatured = FEATURED_WORKS.some(fw => a.title?.includes(fw));
    const bFeatured = FEATURED_WORKS.some(fw => b.title?.includes(fw));
    const aArchived = ARCHIVED_WORKS.some(aw => a.title?.includes(aw));
    const bArchived = ARCHIVED_WORKS.some(aw => b.title?.includes(aw));
    const aHasImage = a.image && !a.image.includes('placeholder');
    const bHasImage = b.image && !b.image.includes('placeholder');
    
    // Archived projects last
    if (aArchived && !bArchived) return 1;
    if (bArchived && !aArchived) return -1;
    
    // Featured projects first
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    
    // Then projects with images
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    
    // Then by year (most recent first)
    return b.year - a.year;
  });

  // NO usar mappings - las imágenes ya vienen del CSV
  const mappedWorks = nonFeaturedWorks;
  
  const VISIBLE_COUNT = 6;
  const hasMore = mappedWorks.length > VISIBLE_COUNT;
  
  function renderWorkCards(worksToRender) {
    return worksToRender.map(work => {
      const hasImage = work.image && !work.image.includes('placeholder');
      const label = work.type || '';
      const location = work.location || '';
      // Truncate description to ~80 chars
      const shortDesc = work.description 
        ? (work.description.length > 80 
            ? work.description.substring(0, 80).trim() + '...' 
            : work.description)
        : '';
      return `
        <article class="project-card ${hasImage ? 'has-image' : ''}">
          ${hasImage ? `
            <div class="project-image">
              <img src="${work.image}" alt="${work.title}">
            </div>
          ` : ''}
          <div class="project-info">
            <span class="project-year">${work.year}${location ? ` · ${location}` : ''}</span>
            <h3 class="project-title">${work.title}</h3>
            ${shortDesc ? `<p class="project-desc">${shortDesc}</p>` : ''}
            ${label ? `<span class="project-label">${label}</span>` : ''}
          </div>
          ${work.link ? `<a href="${work.link}" target="_blank" class="card-link"></a>` : ''}
        </article>
      `;
    }).join('');
  }
  
  // Show curated selection
  const visibleWorks = mappedWorks.slice(0, VISIBLE_COUNT);
  container.innerHTML = renderWorkCards(visibleWorks);
  
  // Add "View all" link if there are more
  if (hasMore) {
    const viewAllLink = document.createElement('div');
    viewAllLink.className = 'view-all-projects';
    viewAllLink.innerHTML = `<a href="#works-full" class="view-all-link">View all projects →</a>`;
    container.parentElement.appendChild(viewAllLink);
    
    viewAllLink.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = renderWorkCards(mappedWorks);
      viewAllLink.remove();
    });
  }
}

function renderTalks(talks) {
  const container = document.getElementById('talks-list');
  container.className = 'timeline-grid';
  
  // Sort by year, then prioritize featured/with images
  talks.sort((a, b) => {
    // First by year (newest first)
    if (b.year !== a.year) return b.year - a.year;
    // Then prioritize featured
    if (a.featured && !b.featured) return -1;
    if (b.featured && !a.featured) return 1;
    return 0;
  });
  
  // Prioritize talks with images or featured for the visible ones
  const withImages = talks.filter(t => t.image || t.featured);
  const withoutImages = talks.filter(t => !t.image && !t.featured);
  const sortedTalks = [...withImages, ...withoutImages];
  
  const VISIBLE_COUNT = 3; // Show only 3 initially
  const visibleTalks = sortedTalks.slice(0, VISIBLE_COUNT);
  const hasMore = talks.length > VISIBLE_COUNT;
  
  function renderTalkCards(items) {
    return items.map((talk) => {
      // NO usar mappings - usar imagen del CSV directamente
      const talkImage = talk.image;
      const hasImage = talkImage && !talkImage.includes('placeholder');
      
      return `
        <article class="timeline-item">
          ${hasImage ? `
            <div class="timeline-item-image">
              <img src="${talkImage}" alt="${talk.title}">
            </div>
          ` : ''}
          <div class="timeline-item-content">
            <span class="type-badge">${talk.type}</span>
            <h3>${talk.link ? `<a href="${talk.link}" target="_blank">${talk.title}</a>` : talk.title}</h3>
            <p class="institution">${talk.institution}</p>
            <div class="meta">
              ${talk.location ? `${talk.location} · ` : ''}${talk.year}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
  
  // Show only first 8 talks initially
  container.innerHTML = renderTalkCards(visibleTalks);
  
  // Handle "More in Talks" click to expand
  const moreLink = document.querySelector('#talks .more-link');
  if (moreLink && hasMore) {
    moreLink.addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = renderTalkCards(talks);
      moreLink.style.display = 'none';
    });
  } else if (moreLink && !hasMore) {
    moreLink.style.display = 'none';
  }
}

// Publications & Talks - Visual carousel with images
function renderVisualCarousel(media, awards, talks) {
  const container = document.getElementById('visual-carousel');
  if (!container) return;
  
  // Filtrar por columna Website si existe
  const hasWebsiteColumn = 
    media.some(m => m.Website !== undefined || m.website !== undefined) ||
    awards.some(a => a.Website !== undefined || a.website !== undefined) ||
    talks.some(t => t.Website !== undefined || t.website !== undefined);
  
  const filterByWebsite = (items) => {
    if (!hasWebsiteColumn) return items;
    return items.filter(item => 
      item.Website === 'X' || item.website === 'x' || item.Website === 'x' || item.website === 'X'
    );
  };
  
  // NO usar mappings - las imágenes ya vienen del CSV
  const mediaWithImages = filterByWebsite(media);
  const awardsFiltered = filterByWebsite(awards);
  const talksFiltered = filterByWebsite(talks);
  
  console.log('Carousel items after Website filter - Media:', mediaWithImages.length, 'Awards:', awardsFiltered.length, 'Talks:', talksFiltered.length);
  
  // Combine media, awards, and talks
  const mediaItems = mediaWithImages.map(m => ({
    ...m,
    itemType: 'Media',
    venue: m.outlet,
    image: m.image || null
  }));
  
  const awardItems = awardsFiltered.map(a => ({
    ...a,
    itemType: 'Award',
    venue: a.institution,
    image: a.image || null
  }));
  
  const talkItems = talksFiltered
    .filter(t => !t.type?.toLowerCase().includes('workshop'))
    .map(t => ({
      ...t,
      itemType: 'Talk',
      venue: t.institution,
      image: t.image || null  // NO usar mappings - usar imagen del CSV
    }));
  
  const allItems = [...mediaItems, ...awardItems, ...talkItems];
  
  // Sort: prioritize TED talks, then items with images, then by year (newest first)
  allItems.sort((a, b) => {
    const aIsTED = a.title?.toLowerCase().includes('ted') || a.venue?.toLowerCase().includes('ted');
    const bIsTED = b.title?.toLowerCase().includes('ted') || b.venue?.toLowerCase().includes('ted');
    
    // TED talks always come first
    if (aIsTED && !bIsTED) return -1;
    if (bIsTED && !aIsTED) return 1;
    
    const aHasImage = a.image && !a.image.includes('placeholder');
    const bHasImage = b.image && !b.image.includes('placeholder');
    
    // Items with images come first
    if (aHasImage && !bHasImage) return -1;
    if (bHasImage && !aHasImage) return 1;
    
    // Then sort by year (newest first)
    return b.year - a.year;
  });
  
  container.innerHTML = allItems.map(item => {
    const hasImage = item.image && !item.image.includes('placeholder');
    
    // Generate unique gradient for cards without images
    const gradientVariants = [
      'linear-gradient(135deg, #e63946 0%, #1a1a2e 50%, #457b9d 100%)',
      'linear-gradient(225deg, #457b9d 0%, #1a1a2e 40%, #e63946 100%)',
      'linear-gradient(180deg, #7b68a6 0%, #1a1a2e 60%, #e63946 100%)',
      'linear-gradient(45deg, #e63946 0%, #7b68a6 50%, #1a1a2e 100%)',
      'linear-gradient(315deg, #457b9d 0%, #7b68a6 40%, #1a1a2e 100%)',
      'linear-gradient(160deg, #1a1a2e 0%, #e63946 30%, #1a1a2e 70%, #457b9d 100%)',
    ];
    const gradientIndex = Math.abs(item.title.length + item.year) % gradientVariants.length;
    const cardGradient = gradientVariants[gradientIndex];
    
    return `
      <article class="visual-card ${hasImage ? 'has-image' : 'no-image'}" 
               ${hasImage ? `style="background-image: url('${item.image}'); background-size: cover; background-position: center;"` : `style="background: ${cardGradient}"`}>
        ${item.itemType === 'Award' ? '<div class="award-badge">🏆</div>' : ''}
        ${item.itemType === 'Talk' ? '<div class="award-badge talk-badge">🎤</div>' : ''}
        <div class="visual-card-overlay"></div>
        <div class="visual-card-content">
          <div class="visual-card-outlet">${item.venue || item.institution || 'Conference'}</div>
          <h3 class="visual-card-title">${item.title}</h3>
          <div class="visual-card-meta">
            <span class="visual-card-type visual-card-type-${item.itemType.toLowerCase()}">${item.itemType}</span>
            <span class="visual-card-year">${item.year}</span>
          </div>
        </div>
        ${item.link ? `<a href="${item.link}" target="_blank" class="visual-card-link"></a>` : ''}
      </article>
    `;
  }).join('');
  
  // Initialize carousel navigation
  initVisualCarousel();
}

function initWorksCarousel() {
  const container = document.getElementById('works-carousel');
  const prevBtn = document.querySelector('.works-nav.prev');
  const nextBtn = document.querySelector('.works-nav.next');
  
  if (!container || !prevBtn || !nextBtn) return;
  
  const scrollAmount = 420; // Larger cards
  
  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

function initVisualCarousel() {
  const container = document.getElementById('visual-carousel');
  const prevBtn = document.querySelector('#publications .mini-nav.prev');
  const nextBtn = document.querySelector('#publications .mini-nav.next');
  
  if (!container) return;
  
  const scrollAmount = 340;
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
}

// Media, Workshops & Awards - Clean text list with tabs
function renderTextList(media, talks, awards = []) {
  const container = document.getElementById('text-list');
  if (!container) return;
  
  // Get only workshops from talks
  const workshops = talks
    .filter(t => t.type?.toLowerCase().includes('workshop'))
    .map(w => ({
      ...w,
      itemType: 'Workshop',
      outlet: w.institution
    }));
  
  // Format awards as announcements
  const awardItems = awards.map(a => ({
    ...a,
    itemType: 'Award',
    outlet: a.institution
  }));
  
  // Combine all items
  const allItems = [
    ...media.map(m => ({ ...m, itemType: 'Media' })),
    ...workshops,
    ...awardItems
  ];
  
  // Sort by relevance: Awards first, then by year
  allItems.sort((a, b) => {
    // Priority: Award > Workshop > Media
    const priority = { 'Award': 3, 'Workshop': 2, 'Media': 1 };
    const aPriority = priority[a.itemType] || 0;
    const bPriority = priority[b.itemType] || 0;
    
    // First by priority, then by year
    if (aPriority !== bPriority) return bPriority - aPriority;
    return b.year - a.year;
  });
  
  // Latest: Mix of most relevant (2 awards, 2 media, 1 workshop if available)
  const latestAwards = allItems.filter(i => i.itemType === 'Award').slice(0, 2);
  const latestMedia = allItems.filter(i => i.itemType === 'Media').slice(0, 2);
  const latestWorkshops = allItems.filter(i => i.itemType === 'Workshop').slice(0, 1);
  
  const latestItems = [...latestAwards, ...latestMedia, ...latestWorkshops]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5);
  
  // Archive: Everything else
  const latestIds = new Set(latestItems.map(i => i.title));
  const archiveItems = allItems
    .filter(i => !latestIds.has(i.title))
    .sort((a, b) => b.year - a.year);
  
  function renderItems(items) {
    if (items.length === 0) {
      return '<p class="no-items">No items in archive.</p>';
    }
    return items.map(item => `
      <article class="text-list-item ${item.itemType.toLowerCase()}">
        <div class="tl-year">${item.year}</div>
        <div class="tl-type">${item.itemType}</div>
        <div class="tl-content">
          <h3>${item.link ? `<a href="${item.link}" target="_blank">${item.title}</a>` : item.title}</h3>
          ${item.outlet ? `<p class="tl-outlet">${item.outlet}</p>` : ''}
        </div>
      </article>
    `).join('');
  }
  
  // Show latest by default
  container.innerHTML = renderItems(latestItems);
  
  // Tab functionality
  const tabs = document.querySelectorAll('#media-workshops .section-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (tab.dataset.tab === 'latest') {
        container.innerHTML = renderItems(latestItems);
      } else {
        container.innerHTML = renderItems(archiveItems);
      }
    });
  });
}

// ======================================
// RESEARCH LIST RENDER (Zoox Style - Image + List for Publications & Talks)
// ======================================
function renderResearchList(publications) {
  const listContainer = document.getElementById('research-list');
  if (!listContainer) {
    console.log('research-list container not found');
    return;
  }

  const pubItems = publications.map(p => ({
    ...p,
    venue: p.journal || p.venue || '',
    image: p.image || null
  }));

  // Filter by Website column if it exists
  const hasWebsiteColumn = pubItems.some(p => p.Website !== undefined || p.website !== undefined);
  let itemsToShow;

  if (hasWebsiteColumn) {
    const filtered = pubItems.filter(p => {
      const v = (p.Website || p.website || '').toString().trim().toUpperCase();
      return v === 'X';
    });
    // Move 'Lomas del Centinela' pub to last
    const lastIdx = filtered.findIndex(p =>
      ['informal urbanism', 'Lomas del Centinela'].some(k => p.title?.toLowerCase().includes(k.toLowerCase()))
    );
    const ordered = [...filtered];
    if (lastIdx !== -1) { const lp = ordered.splice(lastIdx, 1)[0]; ordered.push(lp); }
    itemsToShow = ordered.slice(0, 3);
  } else {
    itemsToShow = pubItems.filter(p =>
      !['Gastronomy', 'Humanized Agent-based', 'Authorea'].some(k => p.title?.includes(k))
    ).slice(0, 3);
  }

  console.log('Rendering publications grid:', itemsToShow.length);

  listContainer.innerHTML = itemsToShow.map((item, i) => {
    const hasImage = item.image && item.image.length > 0;
    const typeLabel = item.type || item.itemType || 'Publication';
    return `
      <div class="pub-card" style="animation-delay:${i * 0.07}s"
           ${item.link ? `onclick="window.open('${item.link}','_blank')" style="cursor:pointer;animation-delay:${i * 0.07}s"` : ''}>
        ${hasImage
          ? `<img class="pub-thumb" src="${item.image}" alt="${item.title}" loading="lazy">`
          : `<div class="pub-thumb pub-thumb--no-img"></div>`}
        <div class="pub-body">
          <div class="pub-title">${item.title}</div>
          <div class="pub-meta">${item.venue ? item.venue + ' · ' : ''}${item.year}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Update research image on hover - cambio instantáneo como Zoox
window.updateResearchImage = function(imageSrc, element) {
  if (!imageSrc) return;
  
  const featuredImage = document.getElementById('research-featured-img');
  const container = document.getElementById('research-featured-image');
  
  if (!featuredImage || !container) return;
  
  // Remover clase active de todos los items
  document.querySelectorAll('.research-item-compact').forEach(item => {
    item.classList.remove('active');
  });
  
  // Añadir clase active al item actual
  if (element) {
    element.classList.add('active');
  }
  
  // Cambio instantáneo de imagen (ya precargadas)
  if (featuredImage.src !== imageSrc) {
    featuredImage.style.opacity = '0.8';
    
    setTimeout(() => {
      featuredImage.src = imageSrc;
      featuredImage.style.opacity = '1';
    }, 100); // Transición ultra rápida como Zoox
  }
};

// ======================================
// MEDIA LIST RENDER (Zoox Style - Image + List)
// ======================================
function renderMediaCards(media) {
  const listContainer = document.getElementById('media-list');
  const featuredImage = document.getElementById('media-featured-img');
  
  if (!listContainer || !featuredImage) {
    console.log('media containers not found');
    return;
  }
  
  // NO usar mappings - las imágenes ya vienen del CSV
  const mediaWithImages = media;
  
  // Sort by year, newest first
  const sortedMedia = mediaWithImages.sort((a, b) => b.year - a.year);
  
  // Take first 8 media items
  const mediaToShow = sortedMedia.slice(0, 8);
  
  console.log('Rendering media list:', mediaToShow.length);
  
  // Set first image as featured
  if (mediaToShow.length > 0 && mediaToShow[0].image) {
    featuredImage.src = mediaToShow[0].image;
  }
  
  // Render list items
  listContainer.innerHTML = mediaToShow.map((item, index) => {
    const badgeText = item.itemType || 'News';
    
    return `
      <a href="${item.link || '#'}" 
         target="_blank" 
         class="media-item-zoox"
         data-image="${item.image || ''}"
         onmouseenter="updateMediaImage('${item.image || ''}')">
        <div class="media-item-content">
          <h3 class="media-item-title">${item.title}</h3>
          <div class="media-item-meta">
            <span class="media-item-badge">${badgeText}</span>
            ${item.outlet ? `<span class="media-item-outlet">${item.outlet}</span>` : ''}
          </div>
        </div>
        <div class="media-item-arrow">→</div>
      </a>
    `;
  }).join('');
  
  console.log('Media list rendered');
}

// Update featured image on hover (global function)
window.updateMediaImage = function(imageSrc) {
  const featuredImage = document.getElementById('media-featured-img');
  if (featuredImage && imageSrc) {
    featuredImage.style.opacity = '0.7';
    setTimeout(() => {
      featuredImage.src = imageSrc;
      featuredImage.style.opacity = '1';
    }, 200);
  }
};

// ======================================
// AWARDS LIST RENDER (Timeline Style)
// ======================================
function renderAwardsList(awards) {
  const container = document.getElementById('awards-list');
  if (!container) {
    console.log('awards-list container not found');
    return;
  }
  
  // Sort by year, newest first
  const sortedAwards = [...awards].sort((a, b) => b.year - a.year);
  
  console.log('Rendering awards:', sortedAwards.length);
  
  container.innerHTML = sortedAwards.map(award => `
    <article class="text-list-item award" data-type="Award">
      <div class="tl-year">${award.year}</div>
      <div class="tl-type">Award</div>
      <div class="tl-content">
        <h3>${award.title}</h3>
        ${award.institution ? `<p class="tl-outlet">${award.institution}</p>` : ''}
      </div>
    </article>
  `).join('');
}

function initPublicationPreview() {
  const preview = document.getElementById('publications-preview');
  if (!preview) return;
  
  const previewImg = preview.querySelector('img');
  const pubCards = document.querySelectorAll('.pub-card[data-image]');
  
  // Collect all images for auto-rotation
  const pubImages = Array.from(pubCards).map(card => card.getAttribute('data-image'));
  let currentImageIndex = 0;
  let autoRotateInterval;
  let isPaused = false;
  
  function showImage(src) {
    if (previewImg) {
      previewImg.style.opacity = '0';
      setTimeout(() => {
        previewImg.src = src;
        previewImg.style.opacity = '1';
      }, 150);
    }
  }
  
  function nextImage() {
    if (isPaused || pubImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % pubImages.length;
    showImage(pubImages[currentImageIndex]);
  }
  
  // Start auto-rotation (every 3 seconds)
  function startAutoRotate() {
    if (pubImages.length > 1) {
      autoRotateInterval = setInterval(nextImage, 3000);
    }
  }
  
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }
  
  // Hover pauses auto-rotation and shows that image
  pubCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      isPaused = true;
      stopAutoRotate();
      const imgIndex = pubImages.indexOf(card.getAttribute('data-image'));
      if (imgIndex !== -1) {
        currentImageIndex = imgIndex;
        showImage(pubImages[currentImageIndex]);
      }
    });
    
    card.addEventListener('mouseleave', () => {
      isPaused = false;
      startAutoRotate();
    });
  });
  
  // Start auto-rotation
  if (pubImages.length > 0) {
    showImage(pubImages[0]);
    startAutoRotate();
  }
}

function renderMedia(media) {
  const container = document.getElementById('media-list');
  container.className = 'media-nyt';
  media.sort((a, b) => b.year - a.year);

  const LATEST_COUNT = 4;
  const latestMedia = media.slice(0, LATEST_COUNT);
  const archiveMedia = media.slice(LATEST_COUNT);
  
  function renderArticles(items) {
    return items.map(item => `
      <article class="media-article">
        <div class="media-date">${item.year}</div>
        <div class="media-body">
          <h3>${item.link ? `<a href="${item.link}" target="_blank">${item.title}</a>` : item.title}</h3>
          <p class="media-author">${item.outlet}</p>
        </div>
      </article>
    `).join('');
  }
  
  // Show latest by default
  container.innerHTML = renderArticles(latestMedia);
  
  // Tab functionality
  const tabs = document.querySelectorAll('.media-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (tab.textContent === 'Highlights') {
        container.innerHTML = renderArticles(latestMedia);
      } else {
        container.innerHTML = archiveMedia.length > 0 
          ? renderArticles(archiveMedia)
          : '<p class="no-archive">No older articles in archive.</p>';
      }
    });
  });
}

function renderAwards(awards) {
  const container = document.getElementById('awards-list');
  awards.sort((a, b) => b.year - a.year);
  
  const MAX_ITEMS = 3; // Show only top 3 awards
  container.innerHTML = awards.slice(0, MAX_ITEMS).map(award => `
    <div class="award-item">
      <span class="year">${award.year}</span>
      <div>
        <h4>${award.title}</h4>
        <p class="institution">${award.institution}</p>
      </div>
    </div>
  `).join('');
}

function renderAbout(about) {
  const MAX_ITEMS = 3; // Show only 3 highlights per category
  
  // Education - top 3 only
  const educationList = document.getElementById('education-list');
  about.education.sort((a, b) => b.year - a.year);
  educationList.innerHTML = about.education.slice(0, MAX_ITEMS).map(edu => `
    <div class="education-item">
      <span class="year">${edu.year}</span>
      <div>
        <h4>${edu.degree}</h4>
        <p class="institution">${edu.institution}</p>
      </div>
    </div>
  `).join('');

  // Experience - top 3 only
  const experienceList = document.getElementById('experience-list');
  about.experience.sort((a, b) => b.year - a.year);
  experienceList.innerHTML = about.experience.slice(0, MAX_ITEMS).map(exp => `
    <div class="experience-item">
      <span class="year">${exp.year}</span>
      <div>
        <h4>${exp.role}</h4>
        <p class="institution">${exp.institution}</p>
      </div>
    </div>
  `).join('');
}

// Render Talks as horizontal carousel with cards
function renderTalksCarousel(talks) {
  const container = document.getElementById('talks-carousel');
  if (!container) return;
  
  // Sort by year (newest first)
  talks.sort((a, b) => b.year - a.year);
  
  // Render carousel cards with image and overlay
  container.innerHTML = talks.map((talk) => {
    // NO usar mappings - usar imagen del CSV directamente
    const localImage = talk.image || null;
    const hasImage = localImage && !localImage.includes('placeholder');
    
    return `
      <article class="talk-card ${hasImage ? '' : 'no-image'}">
        ${hasImage ? `
          <div class="talk-card-image">
            <img src="${localImage}" alt="${talk.title}">
          </div>
        ` : ''}
        <div class="talk-card-overlay">
          <span class="talk-card-year">${talk.year}</span>
          <h3 class="talk-card-title">${talk.title}</h3>
          <p class="talk-card-venue">${talk.institution}</p>
        </div>
        ${talk.link ? `<a href="${talk.link}" target="_blank" class="talk-card-link"></a>` : ''}
      </article>
    `;
  }).join('');
  
  // Initialize carousel navigation
  initTalksCarousel();
}

function initTalksCarousel() {
  const container = document.getElementById('talks-carousel');
  const prevBtn = document.querySelector('.talks-nav.prev');
  const nextBtn = document.querySelector('.talks-nav.next');
  
  if (!container || !prevBtn || !nextBtn) return;
  
  const scrollAmount = 320;
  
  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

// ======================================
// HERO IMAGE/VIDEO LOADER
// ======================================
function renderHeroMedia(data) {
  const heroImage = document.getElementById('hero-image');
  const heroSlide = document.getElementById('hero-slide');
  
  if (!heroImage || !heroSlide) {
    console.log('Hero elements not found');
    return;
  }
  
  // Buscar entrada con Type = "Hero" o "hero"
  const allItems = [
    ...(data.works || []),
    ...(data.publications || []),
    ...(data.media || []),
    ...(data.talks || []),
    ...(data.awards || [])
  ];
  
  const heroEntry = allItems.find(item => 
    item.type?.toLowerCase() === 'hero' || 
    item.Type?.toLowerCase() === 'hero'
  );
  
  if (heroEntry && heroEntry.image) {
    console.log('✅ Hero media found:', heroEntry.image);
    
    // Detectar si es video o imagen
    const isVideo = heroEntry.image.match(/\.(mp4|webm|ogg|mov)$/i);
    
    if (isVideo) {
      // Reemplazar <img> por <video>
      heroSlide.innerHTML = `
        <video autoplay muted loop playsinline id="hero-video">
          <source src="${heroEntry.image}" type="video/mp4">
        </video>
      `;
      console.log('🎬 Video hero loaded');
    } else {
      // Actualizar imagen
      heroImage.src = heroEntry.image;
      heroImage.alt = heroEntry.title || 'Leticia Izquierdo';
      console.log('🖼️ Image hero loaded');
    }
  } else {
    console.log('ℹ️ No Hero entry found in Google Sheet, using default image');
  }
}

// ======================================
// ACTIVITY SECTION RENDER (bento + compact)
// ======================================
function renderActivitySection(media, awards, talks) {
  // The 3 featured bento cards are a fixed editorial choice — they don't change with the sheet.
  // The compact mentions are populated dynamically from the sheet.
  const compactMentions = document.getElementById('activity-compact-mentions');
  if (!compactMentions) return;

  // Merge all items and tag them
  const all = [
    ...media.map(m  => ({ ...m, itemType: 'Media',    venue: m.outlet || m.institution })),
    ...awards.map(a => ({ ...a, itemType: 'Award',    venue: a.institution })),
    ...talks.map(t  => ({ ...t, itemType: 'Talk',     venue: t.institution })),
  ];

  // Filter by Website column if present
  const hasWebsiteCol = all.some(i => i.Website !== undefined || i.website !== undefined);
  const visible = hasWebsiteCol
    ? all.filter(i => (i.Website || i.website || '').toString().trim().toUpperCase() === 'X')
    : all;

  if (visible.length === 0) return;

  // Exclude the 3 hardcoded featured items from the compact list
  const featuredTitles = [
    'transforming cities',     // TEDxBoston
    'carbon impact calculator', // NYC Climate Week
    'family zoning',           // SF Workshop
  ];
  const isFeatured = (title) => featuredTitles.some(k => title?.toLowerCase().includes(k));

  // For compact: past items only (year ≤ current year), no images needed
  const currentYear = new Date().getFullYear();
  const compact = visible
    .filter(i => !isFeatured(i.title) && i.year <= currentYear)
    .sort((a, b) => b.year - a.year)
    .slice(0, 6);

  if (compact.length === 0) return;

  const dotClass = {
    Media: 'compact-dot--talk',
    Award: 'compact-dot--award',
    Talk:  'compact-dot--talk',
  };

  compactMentions.innerHTML = compact.map(item => `
    <div class="compact-item">
      <span class="compact-dot ${dotClass[item.itemType] || 'compact-dot--talk'}"></span>
      <span class="compact-name">${item.title}</span>
      <span class="compact-where">· ${[item.venue, item.year].filter(Boolean).join(', ')}</span>
    </div>
  `).join('');
}

// ======================================
// UPCOMING EVENTS RENDER
// ======================================
function renderUpcoming(upcomingItems) {
  const container = document.querySelector('#upcoming-section .upcoming-grid');
  
  if (!container) {
    console.log('Upcoming container not found');
    return;
  }
  
  if (!upcomingItems || upcomingItems.length === 0) {
    console.log('No upcoming events');
    // Mantener el contenido por defecto del HTML
    return;
  }
  
  console.log('Rendering upcoming events:', upcomingItems.length);
  
  // Ordenar por año (más reciente primero)
  const sorted = [...upcomingItems].sort((a, b) => b.year - a.year);
  
  // Render into the ticker inside the hero
  const ticker = document.getElementById('upcoming-banner-items');
  if (!ticker) return;

  // Build ticker items — Title · Institution (· Location if different)
  const makeItem = (item) => {
    const parts = [item.institution, item.location].filter(Boolean);
    const meta = [...new Set(parts)].join(' · '); // deduplicate
    const text = meta ? `${item.title} · ${meta}` : item.title;
    return `<span class="upcoming-ticker-item">${text}</span><span class="upcoming-ticker-sep">—</span>`;
  };

  const track = sorted.map(makeItem).join('');
  ticker.innerHTML = `<div class="upcoming-ticker-track">${track}${track}</div>`;
}

// ======================================
// SCROLL REVEAL ANIMATIONS (Zoox Style)
// ======================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { 
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px' 
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Initialize scroll reveal on page load
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParallaxScroll();
  initScrollProgress();
});

// ======================================
// PARALLAX SCROLLING (Zoox Style - Smooth)
// ======================================
function initParallaxScroll() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.dataset.parallax) || 0.5;
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrolled;
          const elementHeight = element.offsetHeight;
          
          // Only apply parallax when element is in viewport
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(scrolled - elementTop) * speed;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
          }
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ======================================
// SCROLL PROGRESS INDICATOR
// ======================================
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}
