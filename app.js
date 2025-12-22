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
    latest: 'Latest',
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
    toggle.classList.toggle('active');
    content.classList.toggle('open');
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
      console.log('Works:', data.works?.length, 'Talks:', data.talks?.length);
      if (data.works?.length) renderWorks(data.works);
      // Publications & Talks (with images)
      renderVisualCarousel(data.publications || [], data.talks || []);
      // Media, Workshops & Awards (text list)
      renderTextList(data.media || [], data.talks || [], data.awards || []);
      if (data.about) renderAbout(data.about);
    } else {
      console.error('No data received from Google Sheets');
      document.getElementById('works-grid').innerHTML = '<p style="padding: 2rem; color: #666;">Loading data... If this persists, please refresh the page.</p>';
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
    document.getElementById('works-grid').innerHTML = '<p style="padding: 2rem; color: red;">Error loading data. Please check console.</p>';
  }
});

// Actualizar enlaces de redes sociales dinámicamente
function updateSocialLinks(socials) {
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
  
  console.log('Social links loaded:', links);
}

// MIT Media Lab style - smart grid filling with paired cards
// Mapping de imágenes para Works/Projects
const WORK_IMAGES = {
  'PIX Moving': 'Images/PIX.png',
  'Urban Robot': 'Images/PIX.png',
  'Rebuild the City with Autonomous Mobility': 'Images/PIX.png',
  'Ghaf Woods': 'Images/Ghafs.jpg',
  'Ghaf': 'Images/Ghafs.jpg',
  'Gastronomy': 'Images/gastronomy.png',
  'gastronomy': 'Images/gastronomy.png',
  'Active Carbon Sink': 'Images/Canopy.jpg',  // Must be BEFORE 'Carbon'
  'Manzanares': 'Images/Canopy.jpg',
  'Urban AI for Zoning': 'Images/SF.png',
  'Zoning & Development': 'Images/SF.png',
  'Madrid Nuevo Norte': 'Images/MNN.jpeg',
  'Carbon': 'Images/20241116_NAHM_AM_146.png',
  'Neighborhood-Scale': 'Images/20241116_NAHM_AM_146.png',
  'Affordable Housing': 'Images/Doshi.jpg',
  'Displaced Communities': 'Images/Doshi.jpg',
  // Añade más: 'Nombre del proyecto': 'Images/imagen.jpg'
};

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

function renderWorks(works) {
  const container = document.getElementById('works-grid');
  if (!container) return;
  
  // Sort: featured first, archived last, then by year, then by having image
  works.sort((a, b) => {
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

  // Apply local image mappings
  works = works.map(work => {
    const sortedKeys = Object.keys(WORK_IMAGES).sort((a, b) => b.length - a.length);
    const localImage = sortedKeys.find(key => 
      work.title?.includes(key) || work.institution?.includes(key)
    );
    if (localImage) {
      work.image = WORK_IMAGES[localImage];
    }
    return work;
  });
  
  const VISIBLE_COUNT = 6;
  const hasMore = works.length > VISIBLE_COUNT;
  
  function renderWorkCards(worksToRender) {
    return worksToRender.map(work => {
      const hasImage = work.image && !work.image.includes('placeholder');
      const label = work.institution || work.type || '';
      
      return `
        <article class="project-card ${hasImage ? 'has-image' : ''}">
          ${hasImage ? `
            <div class="project-image">
              <img src="${work.image}" alt="${work.title}">
            </div>
          ` : ''}
          <div class="project-info">
            <span class="project-year">${work.year}</span>
            <h3 class="project-title">${work.title}</h3>
            <span class="project-label">${label}</span>
          </div>
          ${work.link ? `<a href="${work.link}" target="_blank" class="card-link"></a>` : ''}
        </article>
      `;
    }).join('');
  }
  
  // Show curated selection
  const visibleWorks = works.slice(0, VISIBLE_COUNT);
  container.innerHTML = renderWorkCards(visibleWorks);
  
  // Add "View all" link if there are more
  if (hasMore) {
    const viewAllLink = document.createElement('div');
    viewAllLink.className = 'view-all-projects';
    viewAllLink.innerHTML = `<a href="#works-full" class="view-all-link">View all projects →</a>`;
    container.parentElement.appendChild(viewAllLink);
    
    viewAllLink.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = renderWorkCards(works);
      viewAllLink.remove();
    });
  }
}

// Mapping de imágenes locales para talks específicos
const TALK_IMAGES = {
  'Community Carbon Impact Calculator': 'Images/Intro/b82325fe-d869-4f90-8dd8-886df91a5f4e.png',
  'NYC Climate Week': 'Images/Intro/b82325fe-d869-4f90-8dd8-886df91a5f4e.png',
  'Carbon': 'Images/Intro/b82325fe-d869-4f90-8dd8-886df91a5f4e.png'
};

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
  const withImages = talks.filter(t => TALK_IMAGES[t.title] || TALK_IMAGES[t.institution] || t.image || t.featured);
  const withoutImages = talks.filter(t => !TALK_IMAGES[t.title] && !TALK_IMAGES[t.institution] && !t.image && !t.featured);
  const sortedTalks = [...withImages, ...withoutImages];
  
  const VISIBLE_COUNT = 3; // Show only 3 initially
  const visibleTalks = sortedTalks.slice(0, VISIBLE_COUNT);
  const hasMore = talks.length > VISIBLE_COUNT;
  
  function renderTalkCards(items) {
    return items.map((talk) => {
      const localImage = TALK_IMAGES[talk.title] || TALK_IMAGES[talk.institution];
      const talkImage = localImage || talk.image;
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

// Mapping de imágenes locales para publications
const PUB_IMAGES = {
  'Spanish Pavilion catalogue becoming Venice Architecture Biennale': 'Images/becoming.webp',
  'XIV Bienal Española de Arquitectura y Urbanismo': 'Images/bienale.jpg',
  'Neighborhood-Scale Carbon Emissions Impact': 'Images/catalog-open-ps-ExihbitX.png',
  'Generative Agents': 'Images/adornetto1-3566362-small.gif'  // TODO: Replace with Gen-carlo when available
};

// Default image for publications preview
const DEFAULT_PUB_IMAGE = 'Images/becoming.webp';

// Publications & Talks - Visual carousel with images
function renderVisualCarousel(publications, talks) {
  const container = document.getElementById('visual-carousel');
  if (!container) return;
  
  // Helper to get publication image
  function getPubImage(pub) {
    const localImage = Object.keys(PUB_IMAGES).find(key => pub.title.includes(key));
    return localImage ? PUB_IMAGES[localImage] : (pub.image || null);
  }
  
  // Combine publications and talks (only those that are "Talk" type, not workshops)
  const pubItems = publications.map(p => ({
    ...p,
    itemType: 'Publication',
    venue: p.journal,
    image: getPubImage(p)
  }));
  
  const talkItems = talks
    .filter(t => !t.type?.toLowerCase().includes('workshop'))
    .map(t => ({
      ...t,
      itemType: 'Talk',
      venue: t.institution,
      image: TALK_IMAGES[t.title] || TALK_IMAGES[t.institution] || t.image
    }));
  
  const allItems = [...pubItems, ...talkItems];
  
  // Sort by year (newest first)
  allItems.sort((a, b) => b.year - a.year);
  
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
      <article class="visual-card ${hasImage ? '' : 'no-image'}" ${!hasImage ? `style="background: ${cardGradient}"` : ''}>
        ${hasImage ? `
          <div class="visual-card-image">
            <img src="${item.image}" alt="${item.title}">
          </div>
        ` : ''}
        <div class="visual-card-overlay">
          <span class="visual-card-year">${item.year}</span>
          <h3 class="visual-card-title">${item.title}</h3>
          <p class="visual-card-venue">${item.venue || item.itemType}</p>
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
  
  // Sort by year (newest first)
  allItems.sort((a, b) => b.year - a.year);
  
  // Split into latest (5 items) and archive (rest)
  const LATEST_COUNT = 5;
  const latestItems = allItems.slice(0, LATEST_COUNT);
  const archiveItems = allItems.slice(LATEST_COUNT);
  
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

// Mapping de imágenes para Media
// Añade imágenes reales de los artículos aquí:
// 'Título del artículo': 'Images/nombre-imagen.jpg'
const MEDIA_IMAGES = {
  // 'The goat brigade that stops raging forest fires in Chile': 'Images/goat-chile.jpg',
  // 'Business Insider Interview': 'Images/business-insider.jpg',
};

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
      
      if (tab.textContent === 'Latest') {
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
    const localImage = TALK_IMAGES[talk.title] || TALK_IMAGES[talk.institution] || talk.image;
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
