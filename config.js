// Configuración para leer CV desde Google Sheets

// ACTUALIZA ESTA URL después de publicar tu Google Sheet
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM4nRNvW0kxwWMwaScflXuMKo6SxkAChyLMuI-dOzFOGj_ysPQnnPsmel9UO6QEudePYtJ_ZAYjjNU/pub?output=csv';

// URL para la pestaña Socials (gid=1 para la segunda pestaña)
const GOOGLE_SHEET_SOCIALS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM4nRNvW0kxwWMwaScflXuMKo6SxkAChyLMuI-dOzFOGj_ysPQnnPsmel9UO6QEudePYtJ_ZAYjjNU/pub?gid=1&single=true&output=csv';

const CATEGORY_MAPPING = {
  'Project': 'works',
  'Exhibition': 'works',
  'Exhibit': 'works',
  'Talk': 'talks',
  'Workshop': 'talks',
  'Publication': 'publications',
  'Media': 'media',
  'Award': 'awards',
  'Education': 'about',
  'Experience': 'about'
};

const FEATURED_AWARDS = [
  'First Prize Canopy Competition',
  'Ghaf Woods Experience Centre'
];

const FEATURED_TALKS = [
  'TEDxBoston: Countdown to Artificial General Intelligence'
];

// Headers predeterminados para el CSV (en caso de que no tenga headers)
const DEFAULT_HEADERS = ['Year', 'Type', 'Title', 'Institution', 'City', 'Country', 'Collaborators', 'Link', 'Tags', 'Image_URL', 'Description'];

// Función para parsear CSV manualmente
function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  // Verificar si la primera línea es un header o datos
  const firstLine = lines[0];
  const firstValue = parseCSVLine(firstLine)[0];
  
  // Si el primer valor es un año (número de 4 dígitos), no hay headers
  const hasHeaders = !/^\d{4}$/.test(firstValue?.trim());
  
  const headers = hasHeaders 
    ? parseCSVLine(lines[0]).map(h => h.trim())
    : DEFAULT_HEADERS;
  
  const startIndex = hasHeaders ? 1 : 0;

  const data = [];
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index] ? values[index].trim() : '';
      });
      data.push(entry);
    }
  }
  return data;
}

// Función para parsear una línea CSV (maneja comillas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

// Función para obtener la URL de imagen desde la columna del CSV
function getProjectImage(entry) {
  // Buscar la imagen en varias posibles columnas del CSV
  const imageFields = [
    'Image_URL', 'Image URL', 'ImageURL', 'image_url', 'image url',
    'Images_link', 'Images link', 'Image', 'image', 'Imagen', 'imagen',
    'Media_URL', 'Media URL', 'Photo', 'photo', 'Picture', 'picture'
  ];
  
  for (const field of imageFields) {
    if (entry[field] && entry[field].trim()) {
      return entry[field].trim();
    }
  }
  
  // Si no hay imagen, retorna una imagen placeholder
  return 'images/placeholder.jpg';
}

// Función para cargar datos desde Google Sheets
async function loadCVData() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const text = await response.text();
    const data = parseCSV(text);

    // Organizar datos por categorías
    const organizedData = {
      works: [],
      talks: [],
      publications: [],
      media: [],
      awards: [],
      about: { education: [], experience: [] }
    };

    data.forEach(entry => {
      const category = CATEGORY_MAPPING[entry.Type];

      if (category === 'works') {
        organizedData.works.push({
          year: entry.Year,
          type: entry.Type,
          title: entry.Title,
          location: [entry.City, entry.Country].filter(Boolean).join(', '),
          institution: entry.Institution,
          collaborators: entry.Collaborators,
          description: entry.Description,
          link: entry.Link,
          image: getProjectImage(entry),
          tags: entry.Tags || entry.Tag || ''
        });
      } else if (category === 'talks') {
        organizedData.talks.push({
          year: entry.Year,
          type: entry.Type,
          title: entry.Title,
          institution: entry.Institution,
          location: [entry.City, entry.Country].filter(Boolean).join(', '),
          collaborators: entry.Collaborators,
          link: entry.Link,
          description: entry.Description,
          featured: FEATURED_TALKS.includes(entry.Title),
          image: getProjectImage(entry)
        });
      } else if (category === 'publications') {
        organizedData.publications.push({
          year: entry.Year,
          title: entry.Title,
          journal: entry.Institution,
          authors: entry.Collaborators,
          link: entry.Link,
          description: entry.Description,
          image: getProjectImage(entry)
        });
      } else if (category === 'media') {
        organizedData.media.push({
          year: entry.Year,
          title: entry.Title,
          outlet: entry.Institution,
          link: entry.Link,
          description: entry.Description,
          image: getProjectImage(entry)
        });
      } else if (category === 'awards') {
        organizedData.awards.push({
          year: entry.Year,
          title: entry.Title,
          institution: entry.Institution,
          location: [entry.City, entry.Country].filter(Boolean).join(', '),
          description: entry.Description,
          featured: FEATURED_AWARDS.includes(entry.Title)
        });
      } else if (category === 'about') {
        if (entry.Type === 'Education') {
          organizedData.about.education.push({
            year: entry.Year,
            degree: entry.Title,
            institution: entry.Institution,
            location: [entry.City, entry.Country].filter(Boolean).join(', '),
            description: entry.Description
          });
        } else if (entry.Type === 'Experience') {
          organizedData.about.experience.push({
            year: entry.Year,
            role: entry.Title,
            institution: entry.Institution,
            location: [entry.City, entry.Country].filter(Boolean).join(', '),
            collaborators: entry.Collaborators,
            description: entry.Description
          });
        }
      }
    });

    return organizedData;
  } catch (error) {
    console.error('Error loading CV data:', error);
    return null;
  }
}

// Función para cargar datos de Socials desde Google Sheets
async function loadSocialsData() {
  try {
    const response = await fetch(GOOGLE_SHEET_SOCIALS_URL);
    const text = await response.text();
    const data = parseCSV(text);
    
    // Convertir a objeto clave-valor
    const socials = {};
    data.forEach(entry => {
      // Buscar columnas posibles (Platform/Red, Link/URL)
      const platform = entry.Platform || entry.Red || entry.Name || entry.Nombre || Object.values(entry)[0];
      const link = entry.Link || entry.URL || entry.Enlace || Object.values(entry)[1];
      
      if (platform && link) {
        socials[platform.toLowerCase().trim()] = link.trim();
      }
    });
    
    return socials;
  } catch (error) {
    console.error('Error loading Socials data:', error);
    return null;
  }
}
