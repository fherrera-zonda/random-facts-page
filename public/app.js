// ========================================
// AquaRandom - Main Application
// ========================================

// API Configuration - Set this to your API Gateway URL after deployment
// For local development, use empty string to use relative paths
// For production with API Gateway, set to your API Gateway URL (e.g., 'https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod')
const API_BASE_URL = window.AQUARANDOM_API_URL || '';

// Internationalization strings
const i18n = {
  es: {
    tagline: 'Descubre algo nuevo cada vez',
    remaining: 'Consultas gratuitas restantes',
    selectContent: 'Selecciona un tipo de contenido para comenzar',
    fact: 'Dato Curioso',
    news: 'Noticia',
    sports: 'Deportes',
    meme: 'Meme',
    random: 'Aleatorio',
    footer: 'Cuidemos el agua, cuidemos el planeta',
    cookieTitle: 'Usamos Cookies',
    cookieText: 'Utilizamos cookies para mejorar tu experiencia y mostrarte contenido personalizado. Al aceptar, nos permites recopilar informacion anonima sobre tu visita.',
    accept: 'Aceptar',
    decline: 'Rechazar',
    cookieNote: 'Puedes cambiar tu preferencia en cualquier momento.',
    infoTitle: 'Continua Disfrutando',
    infoText: 'Has alcanzado el limite de consultas gratuitas. Comparte tu informacion para seguir descubriendo contenido increible.',
    nameLabel: 'Nombre (opcional)',
    emailLabel: 'Correo electronico',
    phoneLabel: 'Telefono (opcional)',
    submit: 'Continuar',
    privacyNote: 'Tu informacion esta segura y no sera compartida con terceros.',
    factType: 'Dato Curioso',
    newsType: 'Noticias',
    sportsType: 'Deportes',
    memeType: 'Meme del Dia',
    source: 'Fuente',
    category: 'Categoria',
    cookiesRequired: 'Por favor acepta las cookies para continuar',
    errorLoading: 'Error al cargar contenido. Intenta de nuevo.',
    unlimited: 'Ilimitado'
  },
  en: {
    tagline: 'Discover something new every time',
    remaining: 'Free queries remaining',
    selectContent: 'Select a content type to get started',
    fact: 'Fun Fact',
    news: 'News',
    sports: 'Sports',
    meme: 'Meme',
    random: 'Random',
    footer: 'Take care of water, take care of the planet',
    cookieTitle: 'We Use Cookies',
    cookieText: 'We use cookies to improve your experience and show you personalized content. By accepting, you allow us to collect anonymous information about your visit.',
    accept: 'Accept',
    decline: 'Decline',
    cookieNote: 'You can change your preference at any time.',
    infoTitle: 'Keep Enjoying',
    infoText: 'You have reached the free query limit. Share your information to continue discovering amazing content.',
    nameLabel: 'Name (optional)',
    emailLabel: 'Email address',
    phoneLabel: 'Phone (optional)',
    submit: 'Continue',
    privacyNote: 'Your information is secure and will not be shared with third parties.',
    factType: 'Fun Fact',
    newsType: 'News',
    sportsType: 'Sports',
    memeType: 'Meme of the Day',
    source: 'Source',
    category: 'Category',
    cookiesRequired: 'Please accept cookies to continue',
    errorLoading: 'Error loading content. Please try again.',
    unlimited: 'Unlimited'
  }
};

// Application State
const state = {
  sessionId: null,
  visitorId: null,
  language: 'es',
  hitCount: 0,
  freeHitsLimit: 3,
  cookiesAccepted: false,
  hasProvidedInfo: false
};

// DOM Elements
const elements = {
  langBtn: document.getElementById('langBtn'),
  langText: document.querySelector('.lang-text'),
  hitCounter: document.getElementById('hitCounter'),
  counterBubbles: document.getElementById('counterBubbles'),
  contentArea: document.getElementById('contentArea'),
  placeholder: document.getElementById('placeholder'),
  contentCard: document.getElementById('contentCard'),
  cardType: document.getElementById('cardType'),
  cardBody: document.getElementById('cardBody'),
  btnFact: document.getElementById('btnFact'),
  btnNews: document.getElementById('btnNews'),
  btnSports: document.getElementById('btnSports'),
  btnMeme: document.getElementById('btnMeme'),
  btnRandom: document.getElementById('btnRandom'),
  cookieModal: document.getElementById('cookieModal'),
  acceptCookies: document.getElementById('acceptCookies'),
  declineCookies: document.getElementById('declineCookies'),
  userInfoModal: document.getElementById('userInfoModal'),
  userInfoForm: document.getElementById('userInfoForm'),
  loadingOverlay: document.getElementById('loadingOverlay')
};

// ========================================
// Utility Functions
// ========================================

function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getStoredSessionId() {
  return localStorage.getItem('aqua_session_id');
}

function setStoredSessionId(id) {
  localStorage.setItem('aqua_session_id', id);
}

function getStoredLanguage() {
  return localStorage.getItem('aqua_language') || 'es';
}

function setStoredLanguage(lang) {
  localStorage.setItem('aqua_language', lang);
}

function getMetadata() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer
  };
}

function showLoading() {
  elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
}

// ========================================
// Internationalization
// ========================================

function updateLanguage() {
  const strings = i18n[state.language];
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (strings[key]) {
      el.textContent = strings[key];
    }
  });
  
  // Update language button
  elements.langText.textContent = state.language.toUpperCase();
  
  // Update HTML lang attribute
  document.documentElement.lang = state.language;
}

function toggleLanguage() {
  state.language = state.language === 'es' ? 'en' : 'es';
  setStoredLanguage(state.language);
  updateLanguage();
  
  // Re-render content if displayed
  if (!elements.contentCard.classList.contains('hidden')) {
    // Content will be re-fetched with new language on next click
  }
}

// ========================================
// Counter Display
// ========================================

function updateCounterDisplay() {
  const remaining = Math.max(0, state.freeHitsLimit - state.hitCount);
  
  // Create bubbles
  let bubblesHtml = '';
  for (let i = 0; i < state.freeHitsLimit; i++) {
    const isActive = i < remaining;
    const isUsed = i >= remaining;
    bubblesHtml += `<span class="counter-bubble ${isActive ? 'active' : ''} ${isUsed ? 'used' : ''}"></span>`;
  }
  
  elements.counterBubbles.innerHTML = bubblesHtml;
  
  // Update label if unlimited
  if (state.hasProvidedInfo) {
    elements.hitCounter.querySelector('.counter-label').textContent = i18n[state.language].unlimited;
    elements.counterBubbles.innerHTML = '<span class="counter-bubble active" style="width: 100px; border-radius: 20px;"></span>';
  }
}

// ========================================
// Content Display
// ========================================

function displayContent(content) {
  const strings = i18n[state.language];
  const lang = state.language;
  
  // Hide placeholder, show card
  elements.placeholder.classList.add('hidden');
  elements.contentCard.classList.remove('hidden');
  
  // Trigger re-animation
  elements.contentCard.style.animation = 'none';
  elements.contentCard.offsetHeight; // Force reflow
  elements.contentCard.style.animation = '';
  
  let typeLabel = '';
  let typeIcon = '';
  let bodyHtml = '';
  
  switch (content.type) {
    case 'fact':
      typeLabel = strings.factType;
      typeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
      bodyHtml = `<p>${content.content[lang]}</p>`;
      break;
      
    case 'news':
      typeLabel = strings.newsType;
      typeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"/></svg>';
      const newsContent = content.content[lang] || content.content.en;
      bodyHtml = `
        <h3>${newsContent.title}</h3>
        <p>${newsContent.description}</p>
        ${newsContent.category ? `<p class="source">${strings.category}: ${newsContent.category}</p>` : ''}
        <p class="source">${strings.source}: ${newsContent.source}</p>
      `;
      break;
      
    case 'sports':
      typeLabel = strings.sportsType;
      typeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>';
      const sportsContent = content.content[lang] || content.content.en;
      bodyHtml = `
        <h3>${sportsContent.title}</h3>
        <p>${sportsContent.description}</p>
        ${sportsContent.category ? `<p class="source">${strings.category}: ${sportsContent.category}</p>` : ''}
        <p class="source">${strings.source}: ${sportsContent.source}</p>
      `;
      break;
      
    case 'meme':
      typeLabel = strings.memeType;
      typeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
      
      if (content.content.imageUrl) {
        bodyHtml = `
          <img src="${content.content.imageUrl}" alt="Meme" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 150%27%3E%3Crect fill=%27%23f0f8ff%27 width=%27200%27 height=%27150%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 fill=%27%230099cc%27%3EImage unavailable%3C/text%3E%3C/svg%3E'">
        `;
        
        // Language-specific memes have direct text (not nested by language)
        if (content.content.topText) {
          const topText = typeof content.content.topText === 'string' 
            ? content.content.topText 
            : (content.content.topText[lang] || content.content.topText);
          bodyHtml += `<p class="meme-text">${topText}</p>`;
        }
        if (content.content.bottomText) {
          const bottomText = typeof content.content.bottomText === 'string' 
            ? content.content.bottomText 
            : (content.content.bottomText[lang] || content.content.bottomText);
          bodyHtml += `<p class="meme-text">${bottomText}</p>`;
        }
        if (content.content.title) {
          const title = typeof content.content.title === 'string'
            ? content.content.title
            : (content.content.title[lang] || content.content.title.en || content.content.title);
          bodyHtml += `<p class="meme-text">${title}</p>`;
        }
      }
      break;
  }
  
  elements.cardType.innerHTML = typeIcon + typeLabel;
  elements.cardBody.innerHTML = bodyHtml;
}

// ========================================
// API Calls
// ========================================

async function initializeVisitor() {
  let sessionId = getStoredSessionId();
  
  if (!sessionId) {
    sessionId = generateSessionId();
    setStoredSessionId(sessionId);
  }
  
  state.sessionId = sessionId;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/visitor/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        metadata: getMetadata()
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      state.visitorId = data.visitor.id;
      state.hitCount = data.visitor.hitCount;
      state.cookiesAccepted = data.visitor.cookiesAccepted;
      state.hasProvidedInfo = data.visitor.hasProvidedInfo;
      state.freeHitsLimit = data.config.freeHitsLimit;
      
      updateCounterDisplay();
      
      // Show cookie modal if not accepted
      if (!state.cookiesAccepted) {
        elements.cookieModal.classList.remove('hidden');
      } else {
        elements.cookieModal.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error initializing visitor:', error);
  }
}

async function acceptCookies() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/visitor/accept-cookies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: state.sessionId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      state.cookiesAccepted = true;
      elements.cookieModal.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error accepting cookies:', error);
  }
}

async function fetchContent(contentType) {
  if (!state.cookiesAccepted) {
    alert(i18n[state.language].cookiesRequired);
    elements.cookieModal.classList.remove('hidden');
    return;
  }
  
  showLoading();
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/random`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.sessionId,
        contentType: contentType === 'random' ? null : contentType,
        language: state.language
      })
    });
    
    const data = await response.json();
    
    hideLoading();
    
    if (data.success) {
      state.hitCount = data.hitCount;
      updateCounterDisplay();
      displayContent(data.content);
      
      if (data.requiresInfo) {
        setTimeout(() => {
          elements.userInfoModal.classList.remove('hidden');
        }, 500);
      }
    } else if (data.error === 'info_required') {
      state.hitCount = data.hitCount;
      updateCounterDisplay();
      elements.userInfoModal.classList.remove('hidden');
    } else if (data.error === 'cookies_required') {
      elements.cookieModal.classList.remove('hidden');
    } else {
      alert(i18n[state.language].errorLoading);
    }
  } catch (error) {
    hideLoading();
    console.error('Error fetching content:', error);
    alert(i18n[state.language].errorLoading);
  }
}

async function saveUserInfo(formData) {
  showLoading();
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/visitor/save-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.sessionId,
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        preferredLanguage: state.language
      })
    });
    
    const data = await response.json();
    
    hideLoading();
    
    if (data.success) {
      state.hasProvidedInfo = true;
      elements.userInfoModal.classList.add('hidden');
      updateCounterDisplay();
    }
  } catch (error) {
    hideLoading();
    console.error('Error saving user info:', error);
  }
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  // Language toggle
  elements.langBtn.addEventListener('click', toggleLanguage);
  
  // Content buttons
  elements.btnFact.addEventListener('click', () => fetchContent('fact'));
  elements.btnNews.addEventListener('click', () => fetchContent('news'));
  elements.btnSports.addEventListener('click', () => fetchContent('sports'));
  elements.btnMeme.addEventListener('click', () => fetchContent('meme'));
  elements.btnRandom.addEventListener('click', () => fetchContent('random'));
  
  // Cookie modal
  elements.acceptCookies.addEventListener('click', acceptCookies);
  elements.declineCookies.addEventListener('click', () => {
    // User declined - they can't use the service
    elements.cookieModal.classList.add('hidden');
    alert(i18n[state.language].cookiesRequired);
  });
  
  // User info form
  elements.userInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('userName').value,
      email: document.getElementById('userEmail').value,
      phone: document.getElementById('userPhone').value
    };
    
    saveUserInfo(formData);
  });
}

// ========================================
// Initialization
// ========================================

async function init() {
  // Load stored language
  state.language = getStoredLanguage();
  
  // Update UI with language
  updateLanguage();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize visitor session
  await initializeVisitor();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

