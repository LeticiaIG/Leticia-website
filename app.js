// Translations
const translations = {
  en: {
    work: 'Works',
    talks: 'Talks',
    publications: 'Publications',
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
    bioSecondary: "Born in Madrid, trained as an architect and computational designer at UPM — Polytechnic University of Madrid. Spent years working on how technology can make cities more human. Now a PhD researcher at MIT Media Lab's City Science group.",
    roles: ['Urban Researcher', 'Computational Designer', 'PhD Candidate', 'Architect', 'City Scientist']
  },
  es: {
    work: 'Trabajos',
    talks: 'Charlas',
    publications: 'Publicaciones',
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
    bioSecondary: 'Nacida en Madrid, formada como arquitecta y diseñadora computacional en la UPM — Universidad Politécnica de Madrid. Años trabajando en cómo la tecnología puede hacer las ciudades más humanas. Ahora investigadora doctoral en el MIT Media Lab, grupo City Science.',
    roles: ['Investigadora Urbana', 'Diseñadora Computacional', 'Doctoranda', 'Arquitecta', 'City Scientist']
  }
};

let currentLang = 'en';

function switchLanguage() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  const t = translations[currentLang];
  
  // Update nav
  document.querySelector('a[href="#works"]').textContent = t.work;
  document.querySelector('a[href="#talks"]').textContent = t.talks;
  document.querySelector('a[href="#publications"]').textContent = t.publications;
  document.querySelector('a[href="#about"]').textContent = t.about;
  document.getElementById('lang-switch').textContent = currentLang === 'en' ? 'ES' : 'EN';
  
  // Update section headers
  document.querySelector('#works h2').textContent = t.selectedWorks;
  document.querySelector('#talks h2').textContent = t.talksWorkshops;
  document.querySelector('#publications h2').textContent = t.publications;
  
  // Update more links
  const worksMore = document.querySelector('#works .more-link');
  const talksMore = document.querySelector('#talks .more-link');
  const pubsMore = document.querySelector('#publications .more-link');
  const mediaMore = document.querySelector('#media .more-link');
  if (worksMore) worksMore.textContent = t.moreInWorks;
  if (talksMore) talksMore.textContent = t.moreInTalks;
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
  
  // Language switch
  document.getElementById('lang-switch').addEventListener('click', (e) => {
    e.preventDefault();
    switchLanguage();
  });
});

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

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
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
      if (data.talks?.length) renderTalks(data.talks);
      if (data.publications?.length) renderPublications(data.publications);
      if (data.media?.length) renderMedia(data.media);
      if (data.awards?.length) renderAwards(data.awards);
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

  // Apply local image mappings (only if CSV doesn't have a valid image)
  works = works.map(work => {
    // Always check local images first (override CSV)
    // Sort keys by length (longest first) to match most specific key
    const sortedKeys = Object.keys(WORK_IMAGES).sort((a, b) => b.length - a.length);
    const localImage = sortedKeys.find(key => 
      work.title?.includes(key) || work.institution?.includes(key)
    );
    if (localImage) {
      work.image = WORK_IMAGES[localImage];
    }
    return work;
  });
  
  const VISIBLE_COUNT = 12;
  const hasMore = works.length > VISIBLE_COUNT;
  
  function renderWorkCards(worksToRender) {
    let html = '';
    worksToRender.forEach((work, index) => {
      const hasImage = work.image && !work.image.includes('placeholder');
      const isDarkCard = index % 5 === 4;
      
      // Use tags from CSV if available, otherwise use type
      let badgeText = '';
      if (work.tags && work.tags.trim()) {
        badgeText = work.tags.trim();
      } else if (work.type) {
        badgeText = work.type;
      }
      // Highlight Project and Exhibit in accent color
      const isHighlighted = badgeText === 'Project' || badgeText === 'Exhibit' || badgeText.toUpperCase() === 'EXHIBIT';
      const typeTag = badgeText ? `<span class="type-badge${isHighlighted ? ' highlight' : ''}">${badgeText}</span>` : '';
      
      if (hasImage) {
        html += `
          <div class="project-card image-card">
      <div class="project-image">
              <img src="${work.image}" alt="${work.title}" onerror="this.parentElement.parentElement.classList.add('no-image'); this.parentElement.remove();">
      </div>
            <div class="project-overlay">
      <div class="project-content">
                ${typeTag}
        <h3>${work.title}</h3>
              </div>
              <div class="project-meta">
                <p class="date">${work.year}</p>
        <p class="institution">${work.institution}</p>
      </div>
    </div>
            ${work.link ? `<a href="${work.link}" target="_blank" class="card-link"></a>` : ''}
          </div>
        `;
      } else {
        // Text card
        const cardClass = isDarkCard ? 'dark-card' : 'text-card';
        html += `
          <div class="project-card ${cardClass}">
            <div class="project-content">
              ${typeTag}
              <h3>${work.title}</h3>
              ${work.description ? `<p class="description">${work.description}</p>` : ''}
            </div>
            <div class="project-meta">
              <p class="date">${work.year}</p>
              <p class="institution">${work.institution}</p>
              ${work.location ? `<div class="tags"><span class="tag">${work.location.replace(', ', '</span><span class="tag">')}</span></div>` : ''}
            </div>
            ${work.link ? `<a href="${work.link}" target="_blank" class="card-link"></a>` : ''}
          </div>
        `;
      }
    });
    
    return html;
  }
  
  // Show only first works initially
  const visibleWorks = works.slice(0, VISIBLE_COUNT);
  container.innerHTML = renderWorkCards(visibleWorks);
  
  // Handle "More in Works" click to expand
  const moreLink = document.querySelector('#works .more-link');
  if (moreLink && hasMore) {
    moreLink.addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = renderWorkCards(works);
      moreLink.style.display = 'none';
    });
  } else if (moreLink && !hasMore) {
    moreLink.style.display = 'none';
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
  
  const VISIBLE_COUNT = 6; // Show only 6 most attractive
  const visibleTalks = sortedTalks.slice(0, VISIBLE_COUNT);
  const hasMore = talks.length > VISIBLE_COUNT;
  
  function renderTalkCards(items) {
    return items.map((talk, index) => {
      const localImage = TALK_IMAGES[talk.title] || TALK_IMAGES[talk.institution];
      const talkImage = localImage || talk.image;
      const hasImage = talkImage && !talkImage.includes('placeholder');
      const isDark = talk.featured || index % 4 === 3;
      
      const imageStyle = hasImage ? `style="background-image: url('${talkImage}')"` : '';
      const imageClass = hasImage ? 'has-image' : (isDark ? 'featured' : '');
      
      return `
        <div class="timeline-item ${imageClass}" ${imageStyle}>
        <span class="type-badge">${talk.type}</span>
        <h3>${talk.title}</h3>
        <p class="institution">${talk.institution}</p>
        ${talk.description ? `<p class="description">${talk.description}</p>` : ''}
          <div class="meta">
            ${talk.location ? `${talk.location} · ` : ''}${talk.year}
            ${talk.link ? `<br><a href="${talk.link}" target="_blank">View →</a>` : ''}
      </div>
    </div>
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

function renderPublications(publications) {
  const container = document.getElementById('publications-list');
  container.className = 'publications-grid';
  
  // Helper to check if publication has image
  function getPubImage(pub) {
    const localImage = Object.keys(PUB_IMAGES).find(key => pub.title.includes(key));
    return localImage ? PUB_IMAGES[localImage] : (pub.image || null);
  }
  
  // Sort: first by image (with images first), then by year
  publications.sort((a, b) => {
    const aHasImage = getPubImage(a) ? 1 : 0;
    const bHasImage = getPubImage(b) ? 1 : 0;
    if (bHasImage !== aHasImage) return bHasImage - aHasImage;
    return b.year - a.year;
  });

  container.innerHTML = publications.map(pub => {
    const pubImage = getPubImage(pub);
    const hasImage = pubImage && !pubImage.includes('placeholder');
    
    if (hasImage) {
      return `
        <article class="pub-card" ${pub.link ? `onclick="window.open('${pub.link}', '_blank')"` : ''}>
          <div class="pub-image-wrap">
            <img src="${pubImage}" alt="${pub.title}">
          </div>
          <div class="pub-content">
            <span class="pub-year">${pub.year}</span>
            <h3 class="pub-title">${pub.title}</h3>
            ${pub.journal ? `<p class="pub-journal">${pub.journal}</p>` : ''}
          </div>
        </article>
      `;
    } else {
      return `
        <article class="pub-card text-only" ${pub.link ? `onclick="window.open('${pub.link}', '_blank')"` : ''}>
          <div class="pub-image-wrap">
            <span class="pub-placeholder">📄</span>
      </div>
          <div class="pub-content">
            <span class="pub-year">${pub.year}</span>
            <h3 class="pub-title">${pub.title}</h3>
            ${pub.journal ? `<p class="pub-journal">${pub.journal}</p>` : ''}
    </div>
        </article>
      `;
    }
  }).join('');
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
    return items.map(item => {
      const mediaImage = MEDIA_IMAGES[item.title] || item.image;
      return `
        <article class="media-article">
          <div class="media-date">${item.year}</div>
          <div class="media-body">
            <h3>${item.link ? `<a href="${item.link}" target="_blank">${item.title}</a>` : item.title}</h3>
            ${item.description ? `<p class="media-desc">${item.description}</p>` : ''}
            <p class="media-author">By ${item.outlet.toUpperCase()}</p>
      </div>
          ${mediaImage ? `
            <div class="media-thumb">
              <img src="${mediaImage}" alt="${item.title}">
    </div>
          ` : ''}
        </article>
      `;
    }).join('');
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

  container.innerHTML = awards.map(award => `
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
  // Education - compact format
  const educationList = document.getElementById('education-list');
  about.education.sort((a, b) => b.year - a.year);
  educationList.innerHTML = about.education.map(edu => `
    <div class="education-item">
      <span class="year">${edu.year}</span>
      <div>
      <h4>${edu.degree}</h4>
      <p class="institution">${edu.institution}</p>
      </div>
    </div>
  `).join('');

  // Experience - compact format
  const experienceList = document.getElementById('experience-list');
  about.experience.sort((a, b) => b.year - a.year);
  experienceList.innerHTML = about.experience.map(exp => `
    <div class="experience-item">
      <span class="year">${exp.year}</span>
      <div>
      <h4>${exp.role}</h4>
      <p class="institution">${exp.institution}</p>
      </div>
    </div>
  `).join('');
}
