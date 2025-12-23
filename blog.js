// Blog Page JavaScript

// URL for Blog tab in Google Sheet (published version)
const GOOGLE_SHEET_BLOG_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM4nRNvW0kxwWMwaScflXuMKo6SxkAChyLMuI-dOzFOGj_ysPQnnPsmel9UO6QEudePYtJ_ZAYjjNU/pub?gid=1893322321&single=true&output=csv';

// Sample blog data (replace with real data from CSV)
const SAMPLE_BLOG_POSTS = [
    {
        id: 1,
        title: "The Future of Urban AI: From Zoning to Living Cities",
        date: "December 2024",
        excerpt: "How artificial intelligence is reshaping the way we think about urban planning, moving from static regulations to dynamic, responsive city systems.",
        tags: ["AI", "Urban Planning"],
        image: null,
        featured: true,
        googleDocUrl: null
    },
    {
        id: 2,
        title: "Lessons from Ghaf Woods: Biophilic Design in Extreme Climates",
        date: "November 2024",
        excerpt: "Exploring how native vegetation and traditional building wisdom can create sustainable oases in the harshest environments.",
        tags: ["Biophilic Design", "Sustainability"],
        image: null,
        featured: false,
        googleDocUrl: null
    },
    {
        id: 3,
        title: "Community Carbon: Making Climate Data Personal",
        date: "October 2024",
        excerpt: "Why neighborhood-level carbon tracking might be the key to meaningful climate action, and how we built a tool to make it happen.",
        tags: ["Climate", "Data Viz"],
        image: null,
        featured: false,
        googleDocUrl: null
    }
];

// Load blog posts
async function loadBlogPosts() {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;
    
    // Show loading state
    grid.innerHTML = `
        <div class="blog-card loading">
            <div class="blog-card-image loading-skeleton" style="height: 200px;"></div>
            <div class="blog-card-content">
                <div class="loading-skeleton" style="height: 20px; width: 100px; margin-bottom: 1rem;"></div>
                <div class="loading-skeleton" style="height: 30px; width: 80%; margin-bottom: 1rem;"></div>
                <div class="loading-skeleton" style="height: 60px; width: 100%;"></div>
            </div>
        </div>
    `.repeat(3);
    
    // Try to load from Google Sheet
    let posts = SAMPLE_BLOG_POSTS;
    
    try {
        const response = await fetch(GOOGLE_SHEET_BLOG_URL);
        const text = await response.text();
        const csvPosts = parseBlogCSV(text);
        if (csvPosts.length > 0) {
            posts = csvPosts;
            currentPosts = posts;
        }
    } catch (error) {
        console.log('Using sample blog data:', error);
    }
    
    renderBlogPosts(posts);
}

// Parse CSV line (handle quoted fields)
function parseBlogCSVLine(line) {
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

// Parse blog CSV
function parseBlogCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return SAMPLE_BLOG_POSTS;
    
    const headers = parseBlogCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const posts = [];
    
    console.log('Blog headers:', headers);
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseBlogCSVLine(lines[i]);
        const post = {};
        headers.forEach((header, index) => {
            post[header] = values[index]?.trim() || '';
        });
        
        console.log('Parsed post:', post);
        
        posts.push({
            id: i,
            title: post.title,
            date: post.date,
            excerpt: post.excerpt || post.description,
            tags: post.tags ? post.tags.split(',').map(t => t.trim()) : [],
            image: post.image || post.image_url || null,
            featured: i === 1, // First post is featured
            googleDocUrl: post.google_doc_url
        });
    }
    
    return posts;
}

// Render blog posts
function renderBlogPosts(posts) {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;
    
    grid.innerHTML = posts.map((post, index) => {
        const isFeatured = index === 0 && post.featured;
        
        return `
            <article class="blog-card ${isFeatured ? 'featured' : ''}" 
                     onclick="openArticle(${post.id})"
                     data-id="${post.id}"
                     data-doc-url="${post.googleDocUrl || ''}">
                <div class="blog-card-image">
                    ${post.image 
                        ? `<img src="${post.image}" alt="${post.title}">`
                        : `<div class="blog-card-image-placeholder"></div>`
                    }
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-date">${post.date}</span>
                        ${post.tags.length ? `<span class="blog-card-tag">${post.tags[0]}</span>` : ''}
                    </div>
                    <h2 class="blog-card-title">${post.title}</h2>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <span class="blog-card-read">Read article →</span>
                </div>
            </article>
        `;
    }).join('');
}

// Store posts for modal access
let currentPosts = SAMPLE_BLOG_POSTS;

// Open article - redirect to article page
function openArticle(postId) {
    window.location.href = `article.html?id=${postId}`;
}

// Convert Google Doc URL to embed URL
function convertToEmbedUrl(url) {
    // Handle different Google Docs URL formats
    // Format: https://docs.google.com/document/d/DOC_ID/pub
    // or: https://docs.google.com/document/d/DOC_ID/edit
    
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
        const docId = match[1];
        return `https://docs.google.com/document/d/${docId}/pub?embedded=true`;
    }
    return url;
}

// Show fallback content if Google Doc fails
function showFallbackContent(container, post) {
    container.innerHTML = `
        <h1>${post.title}</h1>
        <div class="article-meta">${post.date}</div>
        <div class="article-body">
            <p>${post.excerpt}</p>
            <p style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <strong>Full article coming soon.</strong><br>
                ${post.googleDocUrl 
                    ? `<a href="${post.googleDocUrl}" target="_blank" style="color: var(--accent-red);">Read on Google Docs →</a>`
                    : 'Check back later for the complete article.'
                }
            </p>
        </div>
    `;
}

// Close article modal
function closeArticle() {
    const modal = document.getElementById('article-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeArticle();
    }
});

// Close modal on backdrop click
document.getElementById('article-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'article-modal') {
        closeArticle();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

