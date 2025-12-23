// AquaRandom Lambda Function - Serverless Backend
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables
const VISITORS_TABLE = process.env.VISITORS_TABLE || 'aquarandom-visitors';
const USER_INFO_TABLE = process.env.USER_INFO_TABLE || 'aquarandom-userinfo';
const INTERACTIONS_TABLE = process.env.INTERACTIONS_TABLE || 'aquarandom-interactions';
const FREE_HITS_LIMIT = parseInt(process.env.FREE_HITS_LIMIT) || 3;

// ========================================
// Content Providers (embedded for Lambda)
// ========================================

const funFacts = [
  { en: "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.", es: "La miel nunca se echa a perder. Los arqueologos han encontrado miel de 3000 anos en tumbas egipcias que aun era comestible." },
  { en: "Octopuses have three hearts and blue blood.", es: "Los pulpos tienen tres corazones y sangre azul." },
  { en: "A group of flamingos is called a 'flamboyance'.", es: "Un grupo de flamencos se llama 'flamboyance' (extravagancia)." },
  { en: "Bananas are berries, but strawberries aren't.", es: "Los platanos son bayas, pero las fresas no lo son." },
  { en: "The Eiffel Tower can grow up to 6 inches taller during summer due to thermal expansion.", es: "La Torre Eiffel puede crecer hasta 15 cm en verano debido a la expansion termica." },
  { en: "A day on Venus is longer than a year on Venus.", es: "Un dia en Venus es mas largo que un ano en Venus." },
  { en: "Cows have best friends and get stressed when separated.", es: "Las vacas tienen mejores amigos y se estresan cuando las separan." },
  { en: "The shortest war in history lasted 38 to 45 minutes between Britain and Zanzibar.", es: "La guerra mas corta de la historia duro entre 38 y 45 minutos entre Gran Bretana y Zanzibar." },
  { en: "A jiffy is an actual unit of time: 1/100th of a second.", es: "Un 'jiffy' es una unidad real de tiempo: 1/100 de segundo." },
  { en: "The inventor of the Pringles can is buried in one.", es: "El inventor de la lata de Pringles fue enterrado en una." },
  { en: "Water can boil and freeze at the same time under specific conditions called the 'triple point'.", es: "El agua puede hervir y congelarse al mismo tiempo bajo condiciones especificas llamadas 'punto triple'." },
  { en: "Sharks existed before trees. Sharks have been around for about 400 million years.", es: "Los tiburones existieron antes que los arboles. Han existido por unos 400 millones de anos." },
  { en: "The ocean produces over 50% of the world's oxygen.", es: "El oceano produce mas del 50% del oxigeno del mundo." },
  { en: "A cloud can weigh more than 1 million pounds.", es: "Una nube puede pesar mas de 450,000 kilogramos." },
  { en: "There's enough water in Lake Superior to cover all of North and South America in one foot of water.", es: "Hay suficiente agua en el Lago Superior para cubrir toda America del Norte y del Sur con 30 cm de agua." },
  { en: "El Salvador is the smallest and most densely populated country in Central America.", es: "El Salvador es el pais mas pequeno y densamente poblado de Centroamerica." },
  { en: "El Salvador was the first country in the world to adopt Bitcoin as legal tender in 2021.", es: "El Salvador fue el primer pais del mundo en adoptar Bitcoin como moneda de curso legal en 2021." },
  { en: "The pupusa, El Salvador's national dish, was declared an intangible cultural heritage.", es: "La pupusa, plato nacional de El Salvador, fue declarada patrimonio cultural intangible." }
];

const generalNews = [
  { en: { title: "Ocean Cleanup Project Removes Record Amount of Plastic", description: "The Ocean Cleanup initiative has successfully removed over 200,000 kg of plastic from the Great Pacific Garbage Patch this year.", source: "Environmental News Network", category: "environment" }, es: { title: "Proyecto de Limpieza del Oceano Elimina Cantidad Record de Plastico", description: "La iniciativa Ocean Cleanup ha eliminado con exito mas de 200,000 kg de plastico del Gran Parche de Basura del Pacifico este ano.", source: "Red de Noticias Ambientales", category: "ambiente" } },
  { en: { title: "New Coral Reef Discovery Brings Hope for Marine Life", description: "Scientists discover a thriving coral reef system in deep waters, suggesting marine ecosystems may be more resilient than thought.", source: "Marine Biology Today", category: "environment" }, es: { title: "Nuevo Descubrimiento de Arrecife de Coral Trae Esperanza", description: "Cientificos descubren un sistema de arrecifes de coral prosperando en aguas profundas, sugiriendo que los ecosistemas marinos pueden ser mas resilientes.", source: "Biologia Marina Hoy", category: "ambiente" } },
  { en: { title: "Renewable Energy Now Powers 30% of Global Electricity", description: "A milestone report shows renewable energy sources now account for nearly a third of global electricity generation.", source: "Clean Energy Report", category: "technology" }, es: { title: "Energia Renovable Ahora Alimenta el 30% de la Electricidad Global", description: "Un informe historico muestra que las fuentes de energia renovable ahora representan casi un tercio de la generacion electrica mundial.", source: "Informe de Energia Limpia", category: "tecnologia" } },
  { en: { title: "El Salvador's Tourism Boom: Record Visitor Numbers in 2024", description: "El Salvador reports a significant increase in international tourism, with beaches like El Tunco becoming popular surfing destinations.", source: "Central America Travel News", category: "tourism" }, es: { title: "Boom Turistico en El Salvador: Numeros Record de Visitantes en 2024", description: "El Salvador reporta un aumento significativo en turismo internacional, con playas como El Tunco convirtiendose en destinos de surf populares.", source: "Noticias de Viajes Centroamerica", category: "turismo" } },
  { en: { title: "El Salvador Advances in Digital Innovation", description: "The country continues to lead in cryptocurrency adoption and digital government services.", source: "Tech Central America", category: "technology" }, es: { title: "El Salvador Avanza en Innovacion Digital", description: "El pais continua liderando en adopcion de criptomonedas y servicios de gobierno digital.", source: "Tech Centroamerica", category: "tecnologia" } }
];

const sportsNews = [
  { en: { title: "La Liga: Real Madrid Dominates at Santiago Bernabeu", description: "Real Madrid delivers a masterclass performance at home, with Vinicius Jr and Bellingham leading the attack.", source: "La Liga", category: "La Liga" }, es: { title: "La Liga: Real Madrid Domina en el Santiago Bernabeu", description: "Real Madrid ofrece una actuacion magistral en casa, con Vinicius Jr y Bellingham liderando el ataque.", source: "La Liga", category: "La Liga" } },
  { en: { title: "Premier League: Manchester City Extends Title Race Lead", description: "Pep Guardiola's Manchester City continues their dominant form, with Erling Haaland scoring another hat-trick.", source: "Premier League", category: "Premier League" }, es: { title: "Premier League: Manchester City Extiende Ventaja en la Cima", description: "El Manchester City de Pep Guardiola continua su forma dominante, con Erling Haaland anotando otro hat-trick.", source: "Premier League", category: "Premier League" } },
  { en: { title: "Liga MX: Club America Eyes Another Championship", description: "Las Aguilas del America continue their impressive form in Liga MX, aiming for another title.", source: "Liga MX", category: "Liga MX" }, es: { title: "Liga MX: Club America Busca Otro Campeonato", description: "Las Aguilas del America continuan su impresionante forma en Liga MX, buscando otro titulo.", source: "Liga MX", category: "Liga MX" } },
  { en: { title: "Copa Libertadores: South America's Premier Club Competition", description: "The Copa Libertadores knockout stages deliver drama as the continent's best clubs battle for glory.", source: "CONMEBOL", category: "Copa Libertadores" }, es: { title: "Copa Libertadores: La Maxima Competicion de Clubes de Sudamerica", description: "Las etapas eliminatorias de la Copa Libertadores entregan drama mientras los mejores clubes luchan por la gloria.", source: "CONMEBOL", category: "Copa Libertadores" } },
  { en: { title: "Champions League: Europe's Elite Battle for Glory", description: "The UEFA Champions League knockout rounds deliver thrilling football as Europe's best clubs compete.", source: "UEFA", category: "Champions League" }, es: { title: "Champions League: La Elite Europea Lucha por la Gloria", description: "Las rondas eliminatorias de la UEFA Champions League entregan futbol emocionante.", source: "UEFA", category: "Champions League" } }
];

const spanishMemes = [
  { imageUrl: "https://i.imgflip.com/1otk96.jpg", topText: "Cuando llegas a la playa", bottomText: "y el agua esta helada" },
  { imageUrl: "https://i.imgflip.com/26am.jpg", topText: "Yo explicandole a mi mama", bottomText: "por que necesito mas pupusas" },
  { imageUrl: "https://i.imgflip.com/1bij.jpg", topText: "Uno no simplemente", bottomText: "come solo una pupusa" },
  { imageUrl: "https://i.imgflip.com/30b1gx.jpg", topText: "Cuando finalmente", bottomText: "es viernes" },
  { imageUrl: "https://i.imgflip.com/1ur9b0.jpg", topText: "Es esto", bottomText: "el paraiso? (El Salvador)" }
];

const englishMemes = [
  { imageUrl: "https://i.imgflip.com/1otk96.jpg", topText: "When you arrive at the beach", bottomText: "and the water is freezing" },
  { imageUrl: "https://i.imgflip.com/26am.jpg", topText: "Me explaining to my mom", bottomText: "why I need more snacks" },
  { imageUrl: "https://i.imgflip.com/1bij.jpg", topText: "One does not simply", bottomText: "eat just one slice of pizza" },
  { imageUrl: "https://i.imgflip.com/30b1gx.jpg", topText: "When you finally remember", bottomText: "it's Friday" },
  { imageUrl: "https://i.imgflip.com/1ur9b0.jpg", topText: "Is this", bottomText: "adulting?" }
];

function getRandomFact() {
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  return { type: 'fact', content: fact, id: `fact_${Date.now()}` };
}

function getRandomNews() {
  const news = generalNews[Math.floor(Math.random() * generalNews.length)];
  return { type: 'news', content: news, id: `news_${Date.now()}` };
}

function getRandomSportsNews() {
  const news = sportsNews[Math.floor(Math.random() * sportsNews.length)];
  return { type: 'sports', content: news, id: `sports_${Date.now()}` };
}

function getRandomMeme(language = 'en') {
  const memes = language === 'es' ? spanishMemes : englishMemes;
  const meme = memes[Math.floor(Math.random() * memes.length)];
  return { type: 'meme', content: { imageUrl: meme.imageUrl, topText: meme.topText, bottomText: meme.bottomText, language }, id: `meme_${Date.now()}` };
}

function getRandomContent(language = 'en') {
  const types = ['fact', 'news', 'meme', 'sports'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  switch (randomType) {
    case 'fact': return getRandomFact();
    case 'news': return getRandomNews();
    case 'meme': return getRandomMeme(language);
    case 'sports': return getRandomSportsNews();
    default: return getRandomFact();
  }
}

// ========================================
// Database Operations
// ========================================

async function getVisitorBySession(sessionId) {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: VISITORS_TABLE,
      Key: { sessionId }
    }));
    return result.Item || null;
  } catch (error) {
    console.error('Error getting visitor:', error);
    return null;
  }
}

async function createVisitor(visitorId, sessionId, ipAddress, userAgent, language, platform, screenResolution, timezone, referrer) {
  const visitor = {
    sessionId,
    id: visitorId,
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
  
  try {
    await docClient.send(new PutCommand({
      TableName: VISITORS_TABLE,
      Item: visitor
    }));
    return visitor;
  } catch (error) {
    console.error('Error creating visitor:', error);
    throw error;
  }
}

async function updateCookiesAccepted(sessionId) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: VISITORS_TABLE,
      Key: { sessionId },
      UpdateExpression: 'SET cookiesAccepted = :accepted, cookiesAcceptedAt = :time, updatedAt = :updated',
      ExpressionAttributeValues: {
        ':accepted': true,
        ':time': new Date().toISOString(),
        ':updated': new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error('Error updating cookies:', error);
    throw error;
  }
}

async function incrementHitCount(sessionId) {
  try {
    const result = await docClient.send(new UpdateCommand({
      TableName: VISITORS_TABLE,
      Key: { sessionId },
      UpdateExpression: 'SET hitCount = hitCount + :inc, updatedAt = :updated',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updated': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));
    return result.Attributes;
  } catch (error) {
    console.error('Error incrementing hit count:', error);
    throw error;
  }
}

async function getUserInfoByVisitor(visitorId) {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: USER_INFO_TABLE,
      Key: { visitorId }
    }));
    return result.Item || null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

async function saveUserInfo(visitorId, email, phone, name, preferredLanguage) {
  const userInfo = {
    visitorId,
    email,
    phone,
    name,
    preferredLanguage,
    createdAt: new Date().toISOString()
  };
  
  try {
    await docClient.send(new PutCommand({
      TableName: USER_INFO_TABLE,
      Item: userInfo
    }));
    return userInfo;
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
}

async function logInteraction(visitorId, contentType, contentId) {
  try {
    await docClient.send(new PutCommand({
      TableName: INTERACTIONS_TABLE,
      Item: {
        id: uuidv4(),
        visitorId,
        contentType,
        contentId,
        createdAt: new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error('Error logging interaction:', error);
  }
}

// ========================================
// Response Helpers
// ========================================

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json'
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body)
  };
}

function getClientIP(event) {
  return event.requestContext?.identity?.sourceIp || 
         event.headers?.['X-Forwarded-For']?.split(',')[0] || 
         'unknown';
}

// ========================================
// Lambda Handler
// ========================================

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return response(200, {});
  }
  
  const path = event.path || event.rawPath || '';
  const method = event.httpMethod || event.requestContext?.http?.method;
  
  try {
    // Health check
    if (path.endsWith('/health') && method === 'GET') {
      return response(200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    }
    
    // Get configuration
    if (path.endsWith('/config') && method === 'GET') {
      return response(200, { freeHitsLimit: FREE_HITS_LIMIT });
    }
    
    // Initialize visitor
    if (path.endsWith('/visitor/init') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { sessionId, metadata } = body;
      
      if (!sessionId) {
        return response(400, { success: false, error: 'Session ID required' });
      }
      
      let visitor = await getVisitorBySession(sessionId);
      
      if (!visitor) {
        const visitorId = uuidv4();
        visitor = await createVisitor(
          visitorId,
          sessionId,
          getClientIP(event),
          metadata?.userAgent || event.headers?.['User-Agent'] || 'unknown',
          metadata?.language || 'es',
          metadata?.platform || 'unknown',
          metadata?.screenResolution || 'unknown',
          metadata?.timezone || 'unknown',
          metadata?.referrer || event.headers?.['Referer'] || 'direct'
        );
      }
      
      const userInfo = await getUserInfoByVisitor(visitor.id);
      
      return response(200, {
        success: true,
        visitor: {
          id: visitor.id,
          hitCount: visitor.hitCount,
          cookiesAccepted: visitor.cookiesAccepted === true,
          hasProvidedInfo: !!userInfo
        },
        config: { freeHitsLimit: FREE_HITS_LIMIT }
      });
    }
    
    // Accept cookies
    if (path.endsWith('/visitor/accept-cookies') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { sessionId } = body;
      
      if (!sessionId) {
        return response(400, { success: false, error: 'Session ID required' });
      }
      
      await updateCookiesAccepted(sessionId);
      return response(200, { success: true });
    }
    
    // Save user info
    if (path.endsWith('/visitor/save-info') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { sessionId, email, phone, name, preferredLanguage } = body;
      
      if (!sessionId) {
        return response(400, { success: false, error: 'Session ID required' });
      }
      
      const visitor = await getVisitorBySession(sessionId);
      if (!visitor) {
        return response(404, { success: false, error: 'Visitor not found' });
      }
      
      const existingInfo = await getUserInfoByVisitor(visitor.id);
      if (existingInfo) {
        return response(200, { success: true, message: 'Info already saved' });
      }
      
      await saveUserInfo(visitor.id, email || null, phone || null, name || null, preferredLanguage || 'es');
      return response(200, { success: true });
    }
    
    // Get random content
    if (path.endsWith('/content/random') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { sessionId, contentType, language } = body;
      const lang = language || 'en';
      
      if (!sessionId) {
        return response(400, { success: false, error: 'Session ID required' });
      }
      
      const visitor = await getVisitorBySession(sessionId);
      if (!visitor) {
        return response(404, { success: false, error: 'Visitor not found' });
      }
      
      if (visitor.cookiesAccepted !== true) {
        return response(403, {
          success: false,
          error: 'cookies_required',
          message: 'Please accept cookies to continue'
        });
      }
      
      const userInfo = await getUserInfoByVisitor(visitor.id);
      if (visitor.hitCount >= FREE_HITS_LIMIT && !userInfo) {
        return response(403, {
          success: false,
          error: 'info_required',
          message: 'Please provide your information to continue',
          hitCount: visitor.hitCount,
          limit: FREE_HITS_LIMIT
        });
      }
      
      let content;
      switch (contentType) {
        case 'fact': content = getRandomFact(); break;
        case 'news': content = getRandomNews(); break;
        case 'sports': content = getRandomSportsNews(); break;
        case 'meme': content = getRandomMeme(lang); break;
        default: content = getRandomContent(lang);
      }
      
      const updatedVisitor = await incrementHitCount(sessionId);
      await logInteraction(visitor.id, content.type, content.id);
      
      return response(200, {
        success: true,
        content,
        hitCount: updatedVisitor.hitCount,
        remainingFree: Math.max(0, FREE_HITS_LIMIT - updatedVisitor.hitCount),
        requiresInfo: false
      });
    }
    
    // Route not found
    return response(404, { success: false, error: 'Not found' });
    
  } catch (error) {
    console.error('Error:', error);
    return response(500, { success: false, error: 'Internal server error' });
  }
};

