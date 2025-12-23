const fetch = require('node-fetch');

// Curated fun facts in both languages
const funFacts = [
  {
    en: "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
    es: "La miel nunca se echa a perder. Los arqueologos han encontrado miel de 3000 anos en tumbas egipcias que aun era comestible."
  },
  {
    en: "Octopuses have three hearts and blue blood.",
    es: "Los pulpos tienen tres corazones y sangre azul."
  },
  {
    en: "A group of flamingos is called a 'flamboyance'.",
    es: "Un grupo de flamencos se llama 'flamboyance' (extravagancia)."
  },
  {
    en: "Bananas are berries, but strawberries aren't.",
    es: "Los platanos son bayas, pero las fresas no lo son."
  },
  {
    en: "The Eiffel Tower can grow up to 6 inches taller during summer due to thermal expansion.",
    es: "La Torre Eiffel puede crecer hasta 15 cm en verano debido a la expansion termica."
  },
  {
    en: "A day on Venus is longer than a year on Venus.",
    es: "Un dia en Venus es mas largo que un ano en Venus."
  },
  {
    en: "Cows have best friends and get stressed when separated.",
    es: "Las vacas tienen mejores amigos y se estresan cuando las separan."
  },
  {
    en: "The shortest war in history lasted 38 to 45 minutes between Britain and Zanzibar.",
    es: "La guerra mas corta de la historia duro entre 38 y 45 minutos entre Gran Bretana y Zanzibar."
  },
  {
    en: "A jiffy is an actual unit of time: 1/100th of a second.",
    es: "Un 'jiffy' es una unidad real de tiempo: 1/100 de segundo."
  },
  {
    en: "The inventor of the Pringles can is buried in one.",
    es: "El inventor de la lata de Pringles fue enterrado en una."
  },
  {
    en: "Water can boil and freeze at the same time under specific conditions called the 'triple point'.",
    es: "El agua puede hervir y congelarse al mismo tiempo bajo condiciones especificas llamadas 'punto triple'."
  },
  {
    en: "Sharks existed before trees. Sharks have been around for about 400 million years.",
    es: "Los tiburones existieron antes que los arboles. Han existido por unos 400 millones de anos."
  },
  {
    en: "The ocean produces over 50% of the world's oxygen.",
    es: "El oceano produce mas del 50% del oxigeno del mundo."
  },
  {
    en: "A cloud can weigh more than 1 million pounds.",
    es: "Una nube puede pesar mas de 450,000 kilogramos."
  },
  {
    en: "There's enough water in Lake Superior to cover all of North and South America in one foot of water.",
    es: "Hay suficiente agua en el Lago Superior para cubrir toda America del Norte y del Sur con 30 cm de agua."
  },
  // El Salvador facts
  {
    en: "El Salvador is the smallest and most densely populated country in Central America.",
    es: "El Salvador es el pais mas pequeno y densamente poblado de Centroamerica."
  },
  {
    en: "El Salvador was the first country in the world to adopt Bitcoin as legal tender in 2021.",
    es: "El Salvador fue el primer pais del mundo en adoptar Bitcoin como moneda de curso legal en 2021."
  },
  {
    en: "The pupusa, El Salvador's national dish, was declared an intangible cultural heritage.",
    es: "La pupusa, plato nacional de El Salvador, fue declarada patrimonio cultural intangible."
  }
];

// General and El Salvador news (curated)
const generalNews = [
  // Environmental news
  {
    en: {
      title: "Ocean Cleanup Project Removes Record Amount of Plastic",
      description: "The Ocean Cleanup initiative has successfully removed over 200,000 kg of plastic from the Great Pacific Garbage Patch this year, marking a significant milestone in ocean conservation efforts.",
      source: "Environmental News Network",
      category: "environment"
    },
    es: {
      title: "Proyecto de Limpieza del Oceano Elimina Cantidad Record de Plastico",
      description: "La iniciativa Ocean Cleanup ha eliminado con exito mas de 200,000 kg de plastico del Gran Parche de Basura del Pacifico este ano, marcando un hito significativo en los esfuerzos de conservacion oceanica.",
      source: "Red de Noticias Ambientales",
      category: "ambiente"
    }
  },
  {
    en: {
      title: "New Coral Reef Discovery Brings Hope for Marine Life",
      description: "Scientists discover a thriving coral reef system in deep waters off the coast of Tahiti, suggesting marine ecosystems may be more resilient than previously thought.",
      source: "Marine Biology Today",
      category: "environment"
    },
    es: {
      title: "Nuevo Descubrimiento de Arrecife de Coral Trae Esperanza",
      description: "Cientificos descubren un sistema de arrecifes de coral prosperando en aguas profundas frente a la costa de Tahiti, sugiriendo que los ecosistemas marinos pueden ser mas resilientes de lo que se pensaba.",
      source: "Biologia Marina Hoy",
      category: "ambiente"
    }
  },
  {
    en: {
      title: "Renewable Energy Now Powers 30% of Global Electricity",
      description: "A milestone report shows renewable energy sources now account for nearly a third of global electricity generation, with solar and wind leading the transition.",
      source: "Clean Energy Report",
      category: "technology"
    },
    es: {
      title: "Energia Renovable Ahora Alimenta el 30% de la Electricidad Global",
      description: "Un informe historico muestra que las fuentes de energia renovable ahora representan casi un tercio de la generacion electrica mundial, con la solar y eolica liderando la transicion.",
      source: "Informe de Energia Limpia",
      category: "tecnologia"
    }
  },
  // El Salvador specific news
  {
    en: {
      title: "El Salvador's Tourism Boom: Record Visitor Numbers in 2024",
      description: "El Salvador reports a significant increase in international tourism, with beaches like El Tunco and La Libertad becoming popular surfing destinations worldwide.",
      source: "Central America Travel News",
      category: "tourism"
    },
    es: {
      title: "Boom Turistico en El Salvador: Numeros Record de Visitantes en 2024",
      description: "El Salvador reporta un aumento significativo en turismo internacional, con playas como El Tunco y La Libertad convirtiendose en destinos de surf populares a nivel mundial.",
      source: "Noticias de Viajes Centroamerica",
      category: "turismo"
    }
  },
  {
    en: {
      title: "El Salvador Advances in Digital Innovation",
      description: "The country continues to lead in cryptocurrency adoption and digital government services, attracting tech entrepreneurs and investors from around the world.",
      source: "Tech Central America",
      category: "technology"
    },
    es: {
      title: "El Salvador Avanza en Innovacion Digital",
      description: "El pais continua liderando en adopcion de criptomonedas y servicios de gobierno digital, atrayendo emprendedores tecnologicos e inversionistas de todo el mundo.",
      source: "Tech Centroamerica",
      category: "tecnologia"
    }
  },
  {
    en: {
      title: "El Salvador's Coffee Industry Sees Revival",
      description: "Salvadoran coffee farmers report increased demand for specialty coffee, with the country's volcanic soil producing some of Central America's finest beans.",
      source: "Agricultural Times",
      category: "economy"
    },
    es: {
      title: "Industria Cafetalera de El Salvador Experimenta Resurgimiento",
      description: "Caficultores salvadorenos reportan aumento en demanda de cafe de especialidad, con el suelo volcanico del pais produciendo algunos de los mejores granos de Centroamerica.",
      source: "Tiempos Agricolas",
      category: "economia"
    }
  },
  {
    en: {
      title: "New Marine Protected Areas Established in El Salvador",
      description: "The government announces new marine conservation zones along the Pacific coast to protect sea turtles and marine biodiversity.",
      source: "Conservation Weekly",
      category: "environment"
    },
    es: {
      title: "Nuevas Areas Marinas Protegidas Establecidas en El Salvador",
      description: "El gobierno anuncia nuevas zonas de conservacion marina a lo largo de la costa del Pacifico para proteger tortugas marinas y la biodiversidad marina.",
      source: "Conservacion Semanal",
      category: "ambiente"
    }
  },
  {
    en: {
      title: "El Salvador Invests in Geothermal Energy Expansion",
      description: "The country expands its geothermal power plants, utilizing volcanic activity to generate clean energy and reduce dependence on fossil fuels.",
      source: "Energy News Central America",
      category: "technology"
    },
    es: {
      title: "El Salvador Invierte en Expansion de Energia Geotermica",
      description: "El pais expande sus plantas de energia geotermica, utilizando la actividad volcanica para generar energia limpia y reducir la dependencia de combustibles fosiles.",
      source: "Noticias de Energia Centroamerica",
      category: "tecnologia"
    }
  },
  {
    en: {
      title: "Amazon Rainforest Shows Signs of Recovery",
      description: "Conservation efforts are paying off as satellite data reveals forest regrowth in key protected zones of the Amazon basin.",
      source: "Conservation Weekly",
      category: "environment"
    },
    es: {
      title: "Selva Amazonica Muestra Signos de Recuperacion",
      description: "Los esfuerzos de conservacion estan dando frutos mientras los datos satelitales revelan el crecimiento forestal en zonas protegidas clave de la cuenca amazonica.",
      source: "Conservacion Semanal",
      category: "ambiente"
    }
  },
  {
    en: {
      title: "Cities Worldwide Embrace Urban Farming Initiatives",
      description: "Major cities are converting rooftops and vacant lots into productive urban farms, improving food security and air quality for residents.",
      source: "Urban Green News",
      category: "environment"
    },
    es: {
      title: "Ciudades de Todo el Mundo Adoptan Agricultura Urbana",
      description: "Las grandes ciudades estan convirtiendo azoteas y terrenos baldios en granjas urbanas productivas, mejorando la seguridad alimentaria y calidad del aire.",
      source: "Noticias Verdes Urbanas",
      category: "ambiente"
    }
  }
];

// Sports news (curated with El Salvador focus)
const sportsNews = [
  {
    en: {
      title: "El Salvador National Team Prepares for World Cup Qualifiers",
      description: "La Selecta intensifies training ahead of crucial CONCACAF World Cup qualifying matches, with fans showing strong support across the country.",
      source: "CONCACAF Sports",
      category: "football"
    },
    es: {
      title: "Seleccion de El Salvador se Prepara para Eliminatorias Mundialistas",
      description: "La Selecta intensifica entrenamientos previo a partidos cruciales de eliminatorias mundialistas de CONCACAF, con aficionados mostrando fuerte apoyo en todo el pais.",
      source: "CONCACAF Deportes",
      category: "futbol"
    }
  },
  {
    en: {
      title: "Salvadoran Surfers Shine in International Competition",
      description: "El Salvador's surfing team achieves historic results at the ISA World Surfing Games, showcasing the country's world-class waves.",
      source: "World Surf League",
      category: "surfing"
    },
    es: {
      title: "Surfistas Salvadorenos Brillan en Competencia Internacional",
      description: "El equipo de surf de El Salvador logra resultados historicos en los Juegos Mundiales de Surf ISA, mostrando las olas de clase mundial del pais.",
      source: "Liga Mundial de Surf",
      category: "surf"
    }
  },
  {
    en: {
      title: "Liga Mayor de Futbol: Alianza FC Leads the Championship",
      description: "Alianza FC continues its impressive run in the Salvadoran top division, with fans packing stadiums across the country.",
      source: "El Salvador Football Federation",
      category: "football"
    },
    es: {
      title: "Liga Mayor de Futbol: Alianza FC Lidera el Campeonato",
      description: "Alianza FC continua su impresionante racha en la primera division salvadorena, con aficionados llenando estadios en todo el pais.",
      source: "Federacion Salvadorena de Futbol",
      category: "futbol"
    }
  },
  {
    en: {
      title: "NBA Season Update: Lakers and Celtics Lead Conferences",
      description: "The NBA regular season heats up as traditional powerhouses Lakers and Celtics dominate their respective conferences.",
      source: "NBA News",
      category: "basketball"
    },
    es: {
      title: "Actualizacion NBA: Lakers y Celtics Lideran Conferencias",
      description: "La temporada regular de la NBA se intensifica mientras los tradicionales poderosos Lakers y Celtics dominan sus respectivas conferencias.",
      source: "Noticias NBA",
      category: "baloncesto"
    }
  },
  {
    en: {
      title: "Champions League: Real Madrid Advances to Quarterfinals",
      description: "Real Madrid secures their place in the Champions League quarterfinals with a dominant performance at the Santiago Bernabeu.",
      source: "UEFA",
      category: "football"
    },
    es: {
      title: "Champions League: Real Madrid Avanza a Cuartos de Final",
      description: "Real Madrid asegura su lugar en los cuartos de final de la Champions League con una actuacion dominante en el Santiago Bernabeu.",
      source: "UEFA",
      category: "futbol"
    }
  },
  {
    en: {
      title: "MLB Spring Training: Teams Prepare for New Season",
      description: "Major League Baseball teams begin spring training preparations, with several Salvadoran prospects catching scouts' attention.",
      source: "MLB News",
      category: "baseball"
    },
    es: {
      title: "Entrenamientos de Primavera MLB: Equipos se Preparan",
      description: "Equipos de las Grandes Ligas inician preparativos de entrenamientos de primavera, con varios prospectos salvadorenos llamando la atencion de cazatalentos.",
      source: "Noticias MLB",
      category: "beisbol"
    }
  },
  {
    en: {
      title: "El Salvador Hosts International Beach Soccer Tournament",
      description: "The beaches of La Libertad welcome teams from across the Americas for an exciting beach soccer competition.",
      source: "Beach Soccer Worldwide",
      category: "football"
    },
    es: {
      title: "El Salvador Sede de Torneo Internacional de Futbol Playa",
      description: "Las playas de La Libertad dan la bienvenida a equipos de toda America para una emocionante competencia de futbol playa.",
      source: "Futbol Playa Mundial",
      category: "futbol"
    }
  },
  {
    en: {
      title: "Tennis: Grand Slam Season Approaches with New Stars Rising",
      description: "Young tennis talents emerge as the sport prepares for another exciting Grand Slam season.",
      source: "ATP/WTA Tour",
      category: "tennis"
    },
    es: {
      title: "Tenis: Temporada de Grand Slam se Acerca con Nuevas Estrellas",
      description: "Jovenes talentos del tenis emergen mientras el deporte se prepara para otra emocionante temporada de Grand Slam.",
      source: "ATP/WTA Tour",
      category: "tenis"
    }
  }
];

// Language-specific memes - Spanish memes
const spanishMemes = [
  {
    imageUrl: "https://i.imgflip.com/1otk96.jpg",
    topText: "Cuando llegas a la playa",
    bottomText: "y el agua esta helada"
  },
  {
    imageUrl: "https://i.imgflip.com/26am.jpg",
    topText: "Yo explicandole a mi mama",
    bottomText: "por que necesito mas pupusas"
  },
  {
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    topText: "Cuando dicen que el cafe salvadoreno",
    bottomText: "no es el mejor del mundo"
  },
  {
    imageUrl: "https://i.imgflip.com/4t0m5.jpg",
    topText: "Lunes por la manana",
    bottomText: "sin mi cafecito"
  },
  {
    imageUrl: "https://i.imgflip.com/1bij.jpg",
    topText: "Uno no simplemente",
    bottomText: "come solo una pupusa"
  },
  {
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    topText: "Cuando finalmente",
    bottomText: "es viernes"
  },
  {
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    topText: "Es esto",
    bottomText: "el paraiso? (El Salvador)"
  },
  {
    imageUrl: "https://i.imgflip.com/9ehk.jpg",
    topText: "Yo explicando",
    bottomText: "que las pupusas son vida"
  },
  {
    imageUrl: "https://i.imgflip.com/1bgw.jpg",
    topText: "Por que no",
    bottomText: "visitas El Salvador?"
  },
  {
    imageUrl: "https://i.imgflip.com/2za3u1.jpg",
    topText: "Expectativa: trabajar desde casa",
    bottomText: "Realidad: comer todo el dia"
  }
];

// Language-specific memes - English memes
const englishMemes = [
  {
    imageUrl: "https://i.imgflip.com/1otk96.jpg",
    topText: "When you arrive at the beach",
    bottomText: "and the water is freezing"
  },
  {
    imageUrl: "https://i.imgflip.com/26am.jpg",
    topText: "Me explaining to my mom",
    bottomText: "why I need more snacks"
  },
  {
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    topText: "When they say pineapple",
    bottomText: "belongs on pizza"
  },
  {
    imageUrl: "https://i.imgflip.com/4t0m5.jpg",
    topText: "Monday morning",
    bottomText: "without coffee"
  },
  {
    imageUrl: "https://i.imgflip.com/1bij.jpg",
    topText: "One does not simply",
    bottomText: "eat just one slice of pizza"
  },
  {
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    topText: "When you finally remember",
    bottomText: "it's Friday"
  },
  {
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    topText: "Is this",
    bottomText: "adulting?"
  },
  {
    imageUrl: "https://i.imgflip.com/9ehk.jpg",
    topText: "Me explaining why",
    bottomText: "I need another coffee"
  },
  {
    imageUrl: "https://i.imgflip.com/1bgw.jpg",
    topText: "Y U NO",
    bottomText: "let me sleep in?"
  },
  {
    imageUrl: "https://i.imgflip.com/2za3u1.jpg",
    topText: "Expectation: work from home",
    bottomText: "Reality: snack from home"
  }
];

// Get random fun fact
function getRandomFact() {
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  return {
    type: 'fact',
    content: fact,
    id: `fact_${Date.now()}`
  };
}

// Get random general news
function getRandomNews() {
  const news = generalNews[Math.floor(Math.random() * generalNews.length)];
  return {
    type: 'news',
    content: news,
    id: `news_${Date.now()}`
  };
}

// Get random sports news
function getRandomSportsNews() {
  const news = sportsNews[Math.floor(Math.random() * sportsNews.length)];
  return {
    type: 'sports',
    content: news,
    id: `sports_${Date.now()}`
  };
}

// Get random meme based on language
function getRandomMeme(language = 'en') {
  const memes = language === 'es' ? spanishMemes : englishMemes;
  const meme = memes[Math.floor(Math.random() * memes.length)];
  return {
    type: 'meme',
    content: {
      imageUrl: meme.imageUrl,
      topText: meme.topText,
      bottomText: meme.bottomText,
      language: language
    },
    id: `meme_${Date.now()}`
  };
}

// Get any random content
function getRandomContent(language = 'en') {
  const types = ['fact', 'news', 'meme', 'sports'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  switch (randomType) {
    case 'fact':
      return getRandomFact();
    case 'news':
      return getRandomNews();
    case 'meme':
      return getRandomMeme(language);
    case 'sports':
      return getRandomSportsNews();
    default:
      return getRandomFact();
  }
}

// Fetch external meme based on language
async function fetchExternalMeme(language = 'en') {
  // For Spanish, use curated Spanish memes (better quality/relevance)
  if (language === 'es') {
    return getRandomMeme('es');
  }
  
  // For English, try external API first
  try {
    const response = await fetch('https://meme-api.com/gimme/memes');
    if (response.ok) {
      const data = await response.json();
      if (data.url && !data.nsfw) {
        return {
          type: 'meme',
          content: {
            imageUrl: data.url,
            title: data.title,
            subreddit: data.subreddit,
            language: 'en'
          },
          id: `meme_ext_${Date.now()}`
        };
      }
    }
  } catch (error) {
    console.log('External meme API unavailable, using fallback');
  }
  return getRandomMeme('en');
}

// Fetch sports news from API (with fallback)
async function fetchSportsNews() {
  // Try to fetch from a free sports API
  try {
    const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=' + new Date().toISOString().split('T')[0]);
    if (response.ok) {
      const data = await response.json();
      if (data.events && data.events.length > 0) {
        const event = data.events[Math.floor(Math.random() * Math.min(data.events.length, 10))];
        return {
          type: 'sports',
          content: {
            en: {
              title: `${event.strEvent}`,
              description: `${event.strLeague}: ${event.strHomeTeam} vs ${event.strAwayTeam}. ${event.strVenue ? 'Venue: ' + event.strVenue : ''}`,
              source: 'TheSportsDB',
              category: event.strSport?.toLowerCase() || 'sports'
            },
            es: {
              title: `${event.strEvent}`,
              description: `${event.strLeague}: ${event.strHomeTeam} vs ${event.strAwayTeam}. ${event.strVenue ? 'Lugar: ' + event.strVenue : ''}`,
              source: 'TheSportsDB',
              category: event.strSport?.toLowerCase() || 'deportes'
            }
          },
          id: `sports_ext_${Date.now()}`
        };
      }
    }
  } catch (error) {
    console.log('External sports API unavailable, using fallback');
  }
  return getRandomSportsNews();
}

module.exports = {
  getRandomFact,
  getRandomNews,
  getRandomSportsNews,
  getRandomMeme,
  getRandomContent,
  fetchExternalMeme,
  fetchSportsNews
};
