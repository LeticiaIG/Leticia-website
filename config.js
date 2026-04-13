// Configuración para leer CV desde Google Sheets

// ACTUALIZA ESTA URL después de publicar tu Google Sheet
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM4nRNvW0kxwWMwaScflXuMKo6SxkAChyLMuI-dOzFOGj_ysPQnnPsmel9UO6QEudePYtJ_ZAYjjNU/pub?output=csv';

// URL para la pestaña Socials (gid=1 para la segunda pestaña)
const GOOGLE_SHEET_SOCIALS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM4nRNvW0kxwWMwaScflXuMKo6SxkAChyLMuI-dOzFOGj_ysPQnnPsmel9UO6QEudePYtJ_ZAYjjNU/pub?gid=1&single=true&output=csv';

// ====================================
// DROPBOX AUTO-LINK CONFIGURATION
// ====================================
// PASO 1: Comparte tu carpeta de Dropbox "Leticia-Website-Images"
// PASO 2: Copia el link que te da Dropbox (algo como: https://www.dropbox.com/scl/fo/xxxxx/carpeta?rlkey=yyyy&dl=0)
// PASO 3: Pega ese link aquí y cambia 'fo' por 'fi' y añade tu imagen al final:
// RESULTADO: https://www.dropbox.com/scl/fi/xxxxx/NOMBRE-IMAGEN.jpg?rlkey=yyyy&dl=1

// Configura tu carpeta base de Dropbox aquí:
const DROPBOX_FOLDER_ID = 'zl1neuwyqe2yxl1y5bunp/AEu2OKgEpPUG5fvC2RSMbt0';  // El ID de tu carpeta compartida
const DROPBOX_RLKEY = 'lo2s9jy1eb22tro6qvn86q7wt';   // La rlkey de tu carpeta compartida

// Función para construir URL de Dropbox automáticamente
function buildDropboxURL(filename, type = '') {
  if (!filename) return '';
  
  // Si ya es una URL completa de Dropbox
  if (filename.includes('http')) {
    // Convertir dl=0 a dl=1 automáticamente para visualización directa
    return filename.replace('dl=0', 'dl=1');
  }
  
  // Fallback para construcción manual (por si acaso)
  const url = `https://www.dropbox.com/scl/fo/${DROPBOX_FOLDER_ID}/${filename}?rlkey=${DROPBOX_RLKEY}&raw=1`;
  console.log(`✅ Dropbox URL construida: ${url}`);
  return url;
}

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
  const lines = text.split('\n').filter(line => {
    const trimmed = line.trim();
    // Filter out empty lines, "Upcoming" lines, and lines with only commas
    return trimmed && 
           trimmed !== 'Upcoming' && 
           !trimmed.match(/^,+$/) &&
           trimmed.split(',').some(val => val.trim());
  });
  
  if (lines.length === 0) return [];
  
  // Find header line (contains "Year,Type,Title")
  let headerIndex = lines.findIndex(line => 
    line.includes('Year') && line.includes('Type') && line.includes('Title')
  );
  
  // If no header found at start, check if first line looks like data
  const firstLine = lines[0];
  const firstValue = parseCSVLine(firstLine)[0];
  const firstLineIsData = /^\d{4}$/.test(firstValue?.trim());
  
  let headers, startIndex;
  
  if (headerIndex !== -1 && headerIndex !== 0) {
    // Headers found but not at start - use them and skip data before headers
    console.log(`Found headers at line ${headerIndex}, skipping ${headerIndex} data rows`);
    headers = parseCSVLine(lines[headerIndex]).map(h => h.trim());
    startIndex = headerIndex + 1;
  } else if (headerIndex === 0) {
    // Headers at start (normal case)
    headers = parseCSVLine(lines[0]).map(h => h.trim());
    startIndex = 1;
  } else if (firstLineIsData) {
    // No headers found, first line is data
    console.log('No headers found, using defaults');
    headers = DEFAULT_HEADERS;
    startIndex = 0;
  } else {
    // Fallback
    headers = DEFAULT_HEADERS;
    startIndex = 0;
  }

  const data = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === 'Upcoming') continue;
    
    const values = parseCSVLine(line);
    
    // Skip if this is a header line appearing again
    if (values[0] === 'Year' || values[1] === 'Type') continue;
    
    // Skip if no year (invalid data)
    if (!values[0] || !/^\d{4}$/.test(values[0].trim())) continue;
    
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] ? values[index].trim() : '';
    });
    data.push(entry);
  }
  
  console.log(`Parsed ${data.length} valid entries from CSV`);
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
    'Image_name', 'Image_Name', 'image_name', 'IMAGE_NAME',  // ← Tu columna
    'Image_URL', 'Image URL', 'ImageURL', 'image_url', 'image url',
    'Images_link', 'Images link', 'Image', 'image', 'Imagen', 'imagen',
    'Media_URL', 'Media URL', 'Photo', 'photo', 'Picture', 'picture'
  ];
  
  for (const field of imageFields) {
    if (entry[field] && entry[field].trim()) {
      const imageValue = entry[field].trim();
      // Construir URL de Dropbox con el nombre tal cual está en el Excel
      return buildDropboxURL(imageValue);
    }
  }
  
  // Si no hay imagen, retorna una imagen placeholder
  return 'images/placeholder.jpg';
}

// Función para cargar datos desde Google Sheets
async function loadCVData() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    
    // Check if response is OK (status 200-299)
    if (!response.ok) {
      console.error(`Google Sheet returned status ${response.status}`);
      return null; // Return null to trigger demo data fallback
    }
    
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

    console.log('Organized data:', {
      works: organizedData.works.length,
      publications: organizedData.publications.length,
      talks: organizedData.talks.length,
      media: organizedData.media.length,
      awards: organizedData.awards.length
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
