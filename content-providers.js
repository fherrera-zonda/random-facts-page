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

// Sports news - Latin American & European Major Leagues Focus
const sportsNews = [
  // ========== LA LIGA (Spain) ==========
  {
    en: {
      title: "La Liga: Real Madrid Dominates at Santiago Bernabeu",
      description: "Real Madrid delivers a masterclass performance at home, with Vinicius Jr and Bellingham leading the attack in a convincing victory.",
      source: "La Liga",
      category: "La Liga"
    },
    es: {
      title: "La Liga: Real Madrid Domina en el Santiago Bernabeu",
      description: "Real Madrid ofrece una actuacion magistral en casa, con Vinicius Jr y Bellingham liderando el ataque en una victoria convincente.",
      source: "La Liga",
      category: "La Liga"
    }
  },
  {
    en: {
      title: "El Clasico Preview: Real Madrid vs Barcelona",
      description: "The biggest match in club football approaches as Real Madrid and Barcelona prepare for another epic encounter at the Santiago Bernabeu.",
      source: "La Liga",
      category: "La Liga"
    },
    es: {
      title: "Previa El Clasico: Real Madrid vs Barcelona",
      description: "El partido mas grande del futbol de clubes se acerca mientras Real Madrid y Barcelona se preparan para otro epico encuentro en el Santiago Bernabeu.",
      source: "La Liga",
      category: "La Liga"
    }
  },
  {
    en: {
      title: "Barcelona's Young Stars Shine in La Liga",
      description: "FC Barcelona's La Masia graduates continue to impress, with Lamine Yamal and Pedri orchestrating brilliant attacking football.",
      source: "La Liga",
      category: "La Liga"
    },
    es: {
      title: "Jovenes Estrellas del Barcelona Brillan en La Liga",
      description: "Los graduados de La Masia del FC Barcelona continuan impresionando, con Lamine Yamal y Pedri orquestando un futbol ofensivo brillante.",
      source: "La Liga",
      category: "La Liga"
    }
  },
  {
    en: {
      title: "Atletico Madrid Battles for Top Four Finish",
      description: "Diego Simeone's Atletico Madrid fights for Champions League qualification with their trademark defensive resilience.",
      source: "La Liga",
      category: "La Liga"
    },
    es: {
      title: "Atletico Madrid Lucha por el Top Cuatro",
      description: "El Atletico Madrid de Diego Simeone lucha por la clasificacion a Champions League con su caracteristica solidez defensiva.",
      source: "La Liga",
      category: "La Liga"
    }
  },
  // ========== PREMIER LEAGUE (England) ==========
  {
    en: {
      title: "Premier League: Manchester City Extends Title Race Lead",
      description: "Pep Guardiola's Manchester City continues their dominant form, with Erling Haaland scoring another hat-trick.",
      source: "Premier League",
      category: "Premier League"
    },
    es: {
      title: "Premier League: Manchester City Extiende Ventaja en la Cima",
      description: "El Manchester City de Pep Guardiola continua su forma dominante, con Erling Haaland anotando otro hat-trick.",
      source: "Premier League",
      category: "Premier League"
    }
  },
  {
    en: {
      title: "Liverpool vs Arsenal: Title Decider at Anfield",
      description: "A crucial Premier League clash at Anfield as Liverpool hosts Arsenal in what could be a title-deciding encounter.",
      source: "Premier League",
      category: "Premier League"
    },
    es: {
      title: "Liverpool vs Arsenal: Duelo Decisivo en Anfield",
      description: "Un crucial choque de Premier League en Anfield mientras Liverpool recibe al Arsenal en lo que podria ser un encuentro decisivo por el titulo.",
      source: "Premier League",
      category: "Premier League"
    }
  },
  {
    en: {
      title: "Chelsea Rebuilds Under New Management",
      description: "Chelsea continues their rebuilding project with young talents stepping up at Stamford Bridge.",
      source: "Premier League",
      category: "Premier League"
    },
    es: {
      title: "Chelsea se Reconstruye Bajo Nueva Direccion",
      description: "Chelsea continua su proyecto de reconstruccion con jovenes talentos destacando en Stamford Bridge.",
      source: "Premier League",
      category: "Premier League"
    }
  },
  // ========== SERIE A (Italy) ==========
  {
    en: {
      title: "Serie A: Inter Milan Leads the Scudetto Race",
      description: "Inter Milan dominates Italian football with their solid defense and clinical finishing, leading the Serie A standings.",
      source: "Serie A",
      category: "Serie A"
    },
    es: {
      title: "Serie A: Inter Milan Lidera la Carrera por el Scudetto",
      description: "Inter Milan domina el futbol italiano con su solida defensa y definicion clinica, liderando la tabla de la Serie A.",
      source: "Serie A",
      category: "Serie A"
    }
  },
  {
    en: {
      title: "Juventus vs AC Milan: Derby d'Italia Preview",
      description: "Two Italian giants clash in a historic rivalry match that could define the Champions League qualification race.",
      source: "Serie A",
      category: "Serie A"
    },
    es: {
      title: "Juventus vs AC Milan: Previa del Derby d'Italia",
      description: "Dos gigantes italianos chocan en un historico partido de rivalidad que podria definir la carrera por la clasificacion a Champions.",
      source: "Serie A",
      category: "Serie A"
    }
  },
  {
    en: {
      title: "Napoli Defends Serie A Title with Style",
      description: "The reigning champions Napoli continue to play attractive football as they defend their historic Scudetto.",
      source: "Serie A",
      category: "Serie A"
    },
    es: {
      title: "Napoli Defiende el Titulo de Serie A con Estilo",
      description: "Los actuales campeones Napoli continuan jugando futbol atractivo mientras defienden su historico Scudetto.",
      source: "Serie A",
      category: "Serie A"
    }
  },
  // ========== BUNDESLIGA (Germany) ==========
  {
    en: {
      title: "Bundesliga: Bayern Munich Chases Another Title",
      description: "Bayern Munich continues their pursuit of another Bundesliga title with Harry Kane leading the scoring charts.",
      source: "Bundesliga",
      category: "Bundesliga"
    },
    es: {
      title: "Bundesliga: Bayern Munich Persigue Otro Titulo",
      description: "Bayern Munich continua su busqueda de otro titulo de Bundesliga con Harry Kane liderando la tabla de goleadores.",
      source: "Bundesliga",
      category: "Bundesliga"
    }
  },
  {
    en: {
      title: "Borussia Dortmund's Young Talents Impress",
      description: "Borussia Dortmund's academy continues to produce world-class talents, challenging Bayern's dominance.",
      source: "Bundesliga",
      category: "Bundesliga"
    },
    es: {
      title: "Jovenes Talentos del Borussia Dortmund Impresionan",
      description: "La academia del Borussia Dortmund continua produciendo talentos de clase mundial, desafiando el dominio del Bayern.",
      source: "Bundesliga",
      category: "Bundesliga"
    }
  },
  // ========== LIGA MX (Mexico) ==========
  {
    en: {
      title: "Liga MX: Club America Eyes Another Championship",
      description: "Las Aguilas del America continue their impressive form in Liga MX, aiming for another title at the Azteca.",
      source: "Liga MX",
      category: "Liga MX"
    },
    es: {
      title: "Liga MX: Club America Busca Otro Campeonato",
      description: "Las Aguilas del America continuan su impresionante forma en Liga MX, buscando otro titulo en el Azteca.",
      source: "Liga MX",
      category: "Liga MX"
    }
  },
  {
    en: {
      title: "Clasico Nacional: America vs Chivas Preview",
      description: "Mexico's biggest rivalry match approaches as Club America and Chivas prepare for the Clasico Nacional.",
      source: "Liga MX",
      category: "Liga MX"
    },
    es: {
      title: "Clasico Nacional: America vs Chivas - Previa",
      description: "El partido de mayor rivalidad en Mexico se acerca mientras Club America y Chivas se preparan para el Clasico Nacional.",
      source: "Liga MX",
      category: "Liga MX"
    }
  },
  {
    en: {
      title: "Tigres UANL Dominates in Liga MX Apertura",
      description: "Tigres continues to be a powerhouse in Mexican football, with their French connection leading the attack.",
      source: "Liga MX",
      category: "Liga MX"
    },
    es: {
      title: "Tigres UANL Domina en el Apertura de Liga MX",
      description: "Tigres continua siendo una potencia en el futbol mexicano, con su conexion francesa liderando el ataque.",
      source: "Liga MX",
      category: "Liga MX"
    }
  },
  {
    en: {
      title: "Monterrey vs Cruz Azul: Top of the Table Clash",
      description: "Two Liga MX giants meet in a crucial match that could determine the Liguilla seeding.",
      source: "Liga MX",
      category: "Liga MX"
    },
    es: {
      title: "Monterrey vs Cruz Azul: Choque en la Cima",
      description: "Dos gigantes de Liga MX se enfrentan en un partido crucial que podria determinar la siembra de la Liguilla.",
      source: "Liga MX",
      category: "Liga MX"
    }
  },
  // ========== BRAZILIAN LEAGUE ==========
  {
    en: {
      title: "Brasileirao: Flamengo Leads the Championship",
      description: "Flamengo continues their dominance in Brazilian football, with the Maracana faithful cheering them on.",
      source: "Brasileirao",
      category: "Brasileirao"
    },
    es: {
      title: "Brasileirao: Flamengo Lidera el Campeonato",
      description: "Flamengo continua su dominio en el futbol brasileno, con los fieles del Maracana animandolos.",
      source: "Brasileirao",
      category: "Brasileirao"
    }
  },
  {
    en: {
      title: "Palmeiras vs Corinthians: Paulista Derby",
      description: "Sao Paulo's biggest derby ignites as Palmeiras and Corinthians battle for bragging rights.",
      source: "Brasileirao",
      category: "Brasileirao"
    },
    es: {
      title: "Palmeiras vs Corinthians: Derby Paulista",
      description: "El mayor derby de Sao Paulo se enciende mientras Palmeiras y Corinthians luchan por el orgullo.",
      source: "Brasileirao",
      category: "Brasileirao"
    }
  },
  {
    en: {
      title: "Botafogo Surprises in Brasileirao Title Race",
      description: "Botafogo emerges as a title contender in Brazilian football, bringing excitement back to Rio de Janeiro.",
      source: "Brasileirao",
      category: "Brasileirao"
    },
    es: {
      title: "Botafogo Sorprende en la Carrera por el Titulo",
      description: "Botafogo emerge como contendiente al titulo en el futbol brasileno, trayendo emocion de vuelta a Rio de Janeiro.",
      source: "Brasileirao",
      category: "Brasileirao"
    }
  },
  // ========== ARGENTINE LEAGUE ==========
  {
    en: {
      title: "Liga Argentina: Boca Juniors vs River Plate Superclasico",
      description: "The world's most passionate derby approaches as Boca Juniors hosts River Plate at La Bombonera.",
      source: "Liga Argentina",
      category: "Liga Argentina"
    },
    es: {
      title: "Liga Argentina: Superclasico Boca Juniors vs River Plate",
      description: "El derby mas apasionado del mundo se acerca mientras Boca Juniors recibe a River Plate en La Bombonera.",
      source: "Liga Argentina",
      category: "Liga Argentina"
    }
  },
  {
    en: {
      title: "River Plate Dominates Argentine Football",
      description: "River Plate continues their impressive run in Argentine football, with young talents emerging from their academy.",
      source: "Liga Argentina",
      category: "Liga Argentina"
    },
    es: {
      title: "River Plate Domina el Futbol Argentino",
      description: "River Plate continua su impresionante racha en el futbol argentino, con jovenes talentos emergiendo de su cantera.",
      source: "Liga Argentina",
      category: "Liga Argentina"
    }
  },
  {
    en: {
      title: "Racing Club Challenges for Liga Argentina Title",
      description: "Racing Club from Avellaneda emerges as a serious title contender in the Argentine Primera Division.",
      source: "Liga Argentina",
      category: "Liga Argentina"
    },
    es: {
      title: "Racing Club Desafia por el Titulo de Liga Argentina",
      description: "Racing Club de Avellaneda emerge como serio contendiente al titulo en la Primera Division Argentina.",
      source: "Liga Argentina",
      category: "Liga Argentina"
    }
  },
  // ========== COPA LIBERTADORES ==========
  {
    en: {
      title: "Copa Libertadores: South America's Premier Club Competition",
      description: "The Copa Libertadores knockout stages deliver drama as the continent's best clubs battle for glory.",
      source: "CONMEBOL",
      category: "Copa Libertadores"
    },
    es: {
      title: "Copa Libertadores: La Maxima Competicion de Clubes de Sudamerica",
      description: "Las etapas eliminatorias de la Copa Libertadores entregan drama mientras los mejores clubes del continente luchan por la gloria.",
      source: "CONMEBOL",
      category: "Copa Libertadores"
    }
  },
  {
    en: {
      title: "Copa Libertadores Final: Historic Match Approaches",
      description: "Two South American giants prepare for the biggest match in club football on the continent.",
      source: "CONMEBOL",
      category: "Copa Libertadores"
    },
    es: {
      title: "Final Copa Libertadores: Se Acerca Partido Historico",
      description: "Dos gigantes sudamericanos se preparan para el partido mas grande del futbol de clubes en el continente.",
      source: "CONMEBOL",
      category: "Copa Libertadores"
    }
  },
  // ========== UEFA CHAMPIONS LEAGUE ==========
  {
    en: {
      title: "Champions League: Europe's Elite Battle for Glory",
      description: "The UEFA Champions League knockout rounds deliver thrilling football as Europe's best clubs compete.",
      source: "UEFA",
      category: "Champions League"
    },
    es: {
      title: "Champions League: La Elite Europea Lucha por la Gloria",
      description: "Las rondas eliminatorias de la UEFA Champions League entregan futbol emocionante mientras los mejores clubes de Europa compiten.",
      source: "UEFA",
      category: "Champions League"
    }
  },
  {
    en: {
      title: "Real Madrid's Champions League Legacy Continues",
      description: "The most successful club in Champions League history continues their European dominance.",
      source: "UEFA",
      category: "Champions League"
    },
    es: {
      title: "El Legado de Real Madrid en Champions League Continua",
      description: "El club mas exitoso en la historia de la Champions League continua su dominio europeo.",
      source: "UEFA",
      category: "Champions League"
    }
  },
  // ========== LIGUE 1 (France) ==========
  {
    en: {
      title: "Ligue 1: PSG Continues French Dominance",
      description: "Paris Saint-Germain maintains their grip on French football with their star-studded squad.",
      source: "Ligue 1",
      category: "Ligue 1"
    },
    es: {
      title: "Ligue 1: PSG Continua su Dominio Frances",
      description: "Paris Saint-Germain mantiene su dominio en el futbol frances con su plantilla estelar.",
      source: "Ligue 1",
      category: "Ligue 1"
    }
  },
  {
    en: {
      title: "Monaco and Marseille Challenge PSG's Supremacy",
      description: "AS Monaco and Olympique Marseille emerge as serious challengers to PSG's Ligue 1 dominance.",
      source: "Ligue 1",
      category: "Ligue 1"
    },
    es: {
      title: "Monaco y Marsella Desafian la Supremacia del PSG",
      description: "AS Monaco y Olympique Marsella emergen como serios rivales al dominio del PSG en la Ligue 1.",
      source: "Ligue 1",
      category: "Ligue 1"
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

// Major leagues to filter from API (Latin America & Europe)
const MAJOR_LEAGUES = [
  // European Leagues
  'spanish la liga', 'la liga', 'laliga',
  'english premier league', 'premier league',
  'italian serie a', 'serie a',
  'german bundesliga', 'bundesliga',
  'french ligue 1', 'ligue 1',
  'uefa champions league', 'champions league',
  'uefa europa league', 'europa league',
  // Latin American Leagues
  'liga mx', 'mexican primera',
  'brazilian serie a', 'brasileirao', 'campeonato brasileiro',
  'argentine primera', 'liga argentina', 'superliga argentina',
  'copa libertadores',
  'copa sudamericana'
];

// Check if league is a major league
function isMajorLeague(leagueName) {
  if (!leagueName) return false;
  const lowerLeague = leagueName.toLowerCase();
  return MAJOR_LEAGUES.some(major => lowerLeague.includes(major));
}

// Fetch sports news from API (Latin American & European major leagues focus)
async function fetchSportsNews() {
  // 60% chance to use curated content for variety (better quality)
  const useCurated = Math.random() < 0.6;
  
  if (useCurated) {
    return getRandomSportsNews();
  }
  
  // Try to fetch soccer events from TheSportsDB API
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.events && data.events.length > 0) {
        // Filter for major Latin American and European leagues only
        const majorLeagueEvents = data.events.filter(e => 
          (e.strSport?.toLowerCase() === 'soccer' || e.strSport?.toLowerCase() === 'football') &&
          isMajorLeague(e.strLeague)
        );
        
        if (majorLeagueEvents.length > 0) {
          const event = majorLeagueEvents[Math.floor(Math.random() * Math.min(majorLeagueEvents.length, 10))];
          return {
            type: 'sports',
            content: {
              en: {
                title: `${event.strEvent}`,
                description: `${event.strLeague}: ${event.strHomeTeam} vs ${event.strAwayTeam}. ${event.strVenue ? 'Venue: ' + event.strVenue : ''}`,
                source: event.strLeague || 'Live Match',
                category: event.strLeague || 'Soccer'
              },
              es: {
                title: `${event.strEvent}`,
                description: `${event.strLeague}: ${event.strHomeTeam} vs ${event.strAwayTeam}. ${event.strVenue ? 'Estadio: ' + event.strVenue : ''}`,
                source: event.strLeague || 'Partido en Vivo',
                category: event.strLeague || 'Futbol'
              }
            },
            id: `sports_ext_${Date.now()}`
          };
        }
      }
    }
  } catch (error) {
    console.log('External sports API unavailable, using fallback');
  }
  // Fallback to curated soccer news from major leagues
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
