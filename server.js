require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const {
  createVisitor,
  getVisitorBySession,
  updateCookiesAccepted,
  incrementHitCount,
  getHitCount,
  saveUserInfo,
  getUserInfoByVisitor,
  logInteraction,
  getVisitorStats,
  getRecentVisitors
} = require('./database');

const {
  getRandomFact,
  getRandomNews,
  getRandomSportsNews,
  getRandomMeme,
  getRandomContent,
  fetchExternalMeme,
  fetchSportsNews
} = require('./content-providers');

const app = express();
const PORT = process.env.PORT || 3000;
const FREE_HITS_LIMIT = parseInt(process.env.FREE_HITS_LIMIT) || 3;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         'unknown';
}

// API Routes

// Health check endpoint for deployment platforms
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initialize or get visitor session
app.post('/api/visitor/init', (req, res) => {
  try {
    const { sessionId, metadata } = req.body;
    
    // Check if visitor exists
    let visitor = getVisitorBySession(sessionId);
    
    if (!visitor) {
      // Create new visitor
      const visitorId = uuidv4();
      visitor = createVisitor(
        visitorId,
        sessionId,
        getClientIP(req),
        metadata?.userAgent || req.headers['user-agent'],
        metadata?.language || 'es',
        metadata?.platform || 'unknown',
        metadata?.screenResolution || 'unknown',
        metadata?.timezone || 'unknown',
        metadata?.referrer || req.headers['referer'] || 'direct'
      );
    }
    
    // Check if user has already provided info
    const userInfo = getUserInfoByVisitor(visitor.id);
    
    res.json({
      success: true,
      visitor: {
        id: visitor.id,
        hitCount: visitor.hitCount,
        cookiesAccepted: visitor.cookiesAccepted === true,
        hasProvidedInfo: !!userInfo
      },
      config: {
        freeHitsLimit: FREE_HITS_LIMIT
      }
    });
  } catch (error) {
    console.error('Error initializing visitor:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Accept cookies
app.post('/api/visitor/accept-cookies', (req, res) => {
  try {
    const { sessionId } = req.body;
    updateCookiesAccepted(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error accepting cookies:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Save user information
app.post('/api/visitor/save-info', (req, res) => {
  try {
    const { sessionId, email, phone, name, preferredLanguage } = req.body;
    
    const visitor = getVisitorBySession(sessionId);
    if (!visitor) {
      return res.status(404).json({ success: false, error: 'Visitor not found' });
    }
    
    // Check if already has info
    const existingInfo = getUserInfoByVisitor(visitor.id);
    if (existingInfo) {
      return res.json({ success: true, message: 'Info already saved' });
    }
    
    saveUserInfo(visitor.id, email || null, phone || null, name || null, preferredLanguage || 'es');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user info:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get random content
app.post('/api/content/random', async (req, res) => {
  try {
    const { sessionId, contentType, language } = req.body;
    const lang = language || 'en';
    
    const visitor = getVisitorBySession(sessionId);
    if (!visitor) {
      return res.status(404).json({ success: false, error: 'Visitor not found' });
    }
    
    // Check if cookies accepted
    if (visitor.cookiesAccepted !== true) {
      return res.status(403).json({ 
        success: false, 
        error: 'cookies_required',
        message: 'Please accept cookies to continue'
      });
    }
    
    // Check hit count - block only AFTER they've used all free hits
    const userInfo = getUserInfoByVisitor(visitor.id);
    if (visitor.hitCount >= FREE_HITS_LIMIT && !userInfo) {
      return res.status(403).json({
        success: false,
        error: 'info_required',
        message: 'Please provide your information to continue',
        hitCount: visitor.hitCount,
        limit: FREE_HITS_LIMIT
      });
    }
    
    // Get content based on type
    let content;
    switch (contentType) {
      case 'fact':
        content = getRandomFact();
        break;
      case 'news':
        content = getRandomNews();
        break;
      case 'sports':
        content = await fetchSportsNews();
        break;
      case 'meme':
        content = await fetchExternalMeme(lang);
        break;
      default:
        content = getRandomContent(lang);
    }
    
    // Increment hit count and log interaction
    incrementHitCount(sessionId);
    logInteraction(visitor.id, content.type, content.id);
    
    // Get updated hit count
    const updatedCount = getHitCount(sessionId);
    
    res.json({
      success: true,
      content,
      hitCount: updatedCount.hit_count,
      remainingFree: Math.max(0, FREE_HITS_LIMIT - updatedCount.hit_count),
      requiresInfo: false
    });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get configuration
app.get('/api/config', (req, res) => {
  res.json({
    freeHitsLimit: FREE_HITS_LIMIT
  });
});

// Admin stats (protected in production)
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = getVisitorStats();
    const recentVisitors = getRecentVisitors();
    
    res.json({
      success: true,
      stats,
      recentVisitors
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Agua Random Content Server running on port ${PORT}`);
  console.log(`Free hits limit: ${FREE_HITS_LIMIT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
