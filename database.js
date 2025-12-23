const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Initialize database structure
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      visitors: {},
      userInfo: {},
      interactions: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read database
function readDB() {
  initDB();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { visitors: {}, userInfo: {}, interactions: [] };
  }
}

// Write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Visitor operations
function createVisitor(visitorId, sessionId, ipAddress, userAgent, language, platform, screenResolution, timezone, referrer) {
  const db = readDB();
  
  db.visitors[sessionId] = {
    id: visitorId,
    sessionId,
    ipAddress,
    userAgent,
    language,
    platform,
    screenResolution,
    timezone,
    referrer,
    cookiesAccepted: false,
    cookiesAcceptedAt: null,
    hitCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  writeDB(db);
  return db.visitors[sessionId];
}

function getVisitorBySession(sessionId) {
  const db = readDB();
  return db.visitors[sessionId] || null;
}

function updateCookiesAccepted(sessionId) {
  const db = readDB();
  
  if (db.visitors[sessionId]) {
    db.visitors[sessionId].cookiesAccepted = true;
    db.visitors[sessionId].cookiesAcceptedAt = new Date().toISOString();
    db.visitors[sessionId].updatedAt = new Date().toISOString();
    writeDB(db);
  }
}

function incrementHitCount(sessionId) {
  const db = readDB();
  
  if (db.visitors[sessionId]) {
    db.visitors[sessionId].hitCount += 1;
    db.visitors[sessionId].updatedAt = new Date().toISOString();
    writeDB(db);
  }
}

function getHitCount(sessionId) {
  const db = readDB();
  const visitor = db.visitors[sessionId];
  return visitor ? { hit_count: visitor.hitCount } : { hit_count: 0 };
}

// User info operations
function saveUserInfo(visitorId, email, phone, name, preferredLanguage) {
  const db = readDB();
  
  db.userInfo[visitorId] = {
    visitorId,
    email,
    phone,
    name,
    preferredLanguage,
    createdAt: new Date().toISOString()
  };
  
  writeDB(db);
}

function getUserInfoByVisitor(visitorId) {
  const db = readDB();
  return db.userInfo[visitorId] || null;
}

// Interaction logging
function logInteraction(visitorId, contentType, contentId) {
  const db = readDB();
  
  db.interactions.push({
    visitorId,
    contentType,
    contentId,
    createdAt: new Date().toISOString()
  });
  
  // Keep only last 1000 interactions to prevent file bloat
  if (db.interactions.length > 1000) {
    db.interactions = db.interactions.slice(-1000);
  }
  
  writeDB(db);
}

// Analytics queries
function getVisitorStats() {
  const db = readDB();
  const visitors = Object.values(db.visitors);
  
  return {
    total_visitors: visitors.length,
    accepted_cookies: visitors.filter(v => v.cookiesAccepted).length,
    total_hits: visitors.reduce((sum, v) => sum + v.hitCount, 0)
  };
}

function getRecentVisitors() {
  const db = readDB();
  const visitors = Object.values(db.visitors);
  
  return visitors
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50)
    .map(v => ({
      ...v,
      email: db.userInfo[v.id]?.email || null,
      phone: db.userInfo[v.id]?.phone || null,
      name: db.userInfo[v.id]?.name || null
    }));
}

// Initialize on module load
initDB();

module.exports = {
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
};
