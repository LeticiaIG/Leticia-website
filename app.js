// Translations
const translations = {
  en: {
    work: 'Work',
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
    work: 'Trabajo',
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

// Rotating role text in About section
function initRotatingRole() {
  const roleElement = document.getElementById('rotating-role');
  if (!roleElement) return;
  
  window.currentRoles = translations[currentLang].roles;
  let currentIndex = 0;
  
  setInterval(() => {
    roleElement.classList.add('fade');
    
    setTimeout(() => {
      const roles = window.currentRoles || translations[currentLang].roles;
      currentIndex = (currentIndex + 1) % roles.length;
      roleElement.textContent = roles[currentIndex];
      roleElement.classList.remove('fade');
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
  const AUTO_SLIDE_DELAY = 5000; // 5 seconds
  
  function goToSlide(index) {
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = index;
    
    // Handle wrapping
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
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
      nextSlide();
      resetAutoSlide();
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
  const data = await loadCVData();

  if (data) {
    renderWorks(data.works);
    renderTalks(data.talks);
    renderPublications(data.publications);
    renderMedia(data.media);
    renderAwards(data.awards);
    renderAbout(data.about);
  }
});

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
  'Carbon': 'Images/20241116_NAHM_AM_146.png',
  'Neighborhood-Scale': 'Images/20241116_NAHM_AM_146.png',
  'Affordable Housing': 'Images/Doshi.jpg',
  'Displaced Communities': 'Images/Doshi.jpg',
  // Añade más: 'Nombre del proyecto': 'Images/imagen.jpg'
};

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
  
  // Sort: featured first, then by year, then by having image
  works.sort((a, b) => {
    const aFeatured = FEATURED_WORKS.some(fw => a.title?.includes(fw));
    const bFeatured = FEATURED_WORKS.some(fw => b.title?.includes(fw));
    const aHasImage = a.image && !a.image.includes('placeholder');
    const bHasImage = b.image && !b.image.includes('placeholder');
    
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
    // Si ya tiene una imagen válida del CSV, no la sobreescribimos
    const hasValidCsvImage = work.image && !work.image.includes('placeholder');
    
    if (!hasValidCsvImage) {
      const localImage = Object.keys(WORK_IMAGES).find(key => 
        work.title?.includes(key) || work.institution?.includes(key)
      );
      if (localImage) {
        work.image = WORK_IMAGES[localImage];
      }
    }
    return work;
  });
  
  const VISIBLE_COUNT = 9; // 3 rows of 3 or similar
  const hasMore = works.length > VISIBLE_COUNT;
  
  function renderWorkCards(worksToRender) {
    const columns = 4;
    const worksWithImages = worksToRender.filter(w => w.image && !w.image.includes('placeholder'));
    
    let totalCells = worksToRender.length;
    const remainder = totalCells % columns;
    let extraCellsNeeded = remainder > 0 ? columns - remainder : 0;
    
    const doubleIndices = new Set();
    let extraAdded = 0;
    for (let i = 0; i < worksToRender.length && extraAdded < extraCellsNeeded; i++) {
      const work = worksToRender[i];
      if (work.image && !work.image.includes('placeholder')) {
        doubleIndices.add(i);
        extraAdded++;
      }
    }

    let html = '';
    worksToRender.forEach((work, index) => {
      const hasImage = work.image && !work.image.includes('placeholder');
      const isDoubled = doubleIndices.has(index);
      const isDarkCard = index % 5 === 4;
      
      // Use tags from CSV if available, otherwise use type (if not Project)
      let badgeText = '';
      if (work.tags && work.tags.trim()) {
        badgeText = work.tags.trim();
      } else if (work.type && work.type !== 'Project') {
        badgeText = work.type;
      }
      const typeTag = badgeText ? `<span class="type-badge">${badgeText}</span>` : '';
      
      if (isDoubled && hasImage) {
        html += `
          <div class="project-card text-card">
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
        html += `
          <div class="project-card image-card">
            <div class="project-image">
              <img src="${work.image}" alt="${work.title}">
            </div>
          </div>
        `;
      } else if (hasImage) {
        html += `
          <div class="project-card image-card">
      <div class="project-image">
              <img src="${work.image}" alt="${work.title}" onerror="this.parentElement.parentElement.classList.add('text-card'); this.parentElement.remove();">
      </div>
            <div class="project-overlay">
      <div class="project-content">
                ${typeTag}
        <h3>${work.title}</h3>
                ${work.description ? `<p class="description">${work.description}</p>` : ''}
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
  
  // Show only first 12 works initially
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
  'Neighborhood-Scale Carbon Emissions Impact': 'Images/catalog-open-ps-ExihbitX.png'
};

// Default image for publications preview
const DEFAULT_PUB_IMAGE = 'Images/becoming.webp';

function renderPublications(publications) {
  const container = document.getElementById('publications-list');
  container.className = 'magazine-stack';
  
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
    // Check for local image
    const pubImage = getPubImage(pub);
    const hasImage = pubImage && !pubImage.includes('placeholder');
    
    if (hasImage) {
      return `
        <article class="magazine-card" ${pub.link ? `onclick="window.open('${pub.link}', '_blank')"` : ''}>
          <div class="magazine-bg">
            <img src="${pubImage}" alt="${pub.title}" class="pub-image">
          </div>
          <div class="pub-info">
            <p class="pub-title">${pub.title}</p>
            <p class="pub-date">${pub.journal ? `${pub.journal} · ` : ''}${pub.year}</p>
          </div>
        </article>
      `;
    } else {
      return `
        <article class="magazine-card text-only" ${pub.link ? `onclick="window.open('${pub.link}', '_blank')"` : ''}>
          <div class="magazine-bg">
            <p class="pub-title-large">${pub.title}</p>
      </div>
          <div class="pub-info">
            <p class="pub-date">${pub.journal ? `${pub.journal} · ` : ''}${pub.year}</p>
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
