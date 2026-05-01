/**
 * CHAPTER GENERATION HELPER
 * SEEN by CREOVA
 *
 * Generates missing chapters for incomplete story worlds:
 * - black-atlantic-canada (6 chapters)
 * - what-we-carry (5 chapters)
 * - small-histories (6 chapters)
 * - work-worth (5 chapters)
 *
 * This file provides the narrative content and structure for all 22 missing chapters.
 */

import type { Chapter, ContextCard } from './storyDatabase';
import type { MultilingualText } from './storyDatabase';

// ============================================
// BLACK ATLANTIC CANADA - 6 CHAPTERS
// ============================================

export const blackAtlanticCanadaChapters: Chapter[] = [
  {
    id: 'black-atlantic-canada-ch1',
    order: 1,
    title: {
      en: 'Arrival at Halifax Docks',
      fr: 'Arrivée aux Quais de Halifax',
      es: 'Llegada a los Muelles de Halifax',
    },
    description: {
      en: 'The journey begins as ships arrive carrying stories across the Atlantic.',
      fr: 'Le voyage commence alors que des navires arrivent portant des histoires à travers l\'Atlantique.',
      es: 'El viaje comienza mientras barcos llegan cargando historias a través del Atlántico.',
    },
    text: {
      en: 'The Atlantic wind carries the salt of a thousand journeys. Ship horns echo across Halifax Docks as merchants, enslaved people, and free traders step onto Canadian soil. Among them walks Samuel, carrying a journal and memories of Guinea.',
      fr: 'Le vent Atlantique porte le sel de mille voyages. Les cornes de navire résonnent sur les Quais de Halifax alors que des marchands, des personnes réduites en esclavage et des marchands libres foulent le sol canadien. Parmi eux marche Samuel, portant un journal et des souvenirs de Guinée.',
      es: 'El viento del Atlántico lleva la sal de mil viajes. Las sirenas de los barcos resuenan en los Muelles de Halifax mientras mercaderes, personas esclavizadas y comerciantes libres pisan suelo canadiense. Entre ellos camina Samuel, llevando un diario y recuerdos de Guinea.',
    },
    media: {
      ambient: { url: '/media/ambient/atlantic-docks.mp3' },
      music: { url: '/media/music/journey-begins.mp3' },
    },
    estimatedDuration: 12,
    contextCards: [
      {
        id: 'black-atlantic-ch1-context1',
        type: 'historical',
        title: {
          en: 'The Black Atlantic',
          fr: 'L\'Atlantique Noir',
          es: 'El Atlántico Negro',
        },
        content: {
          en: 'A term describing the cultural and historical connections between Africa, Europe, Americas, and Caribbean created through forced migration and trade routes.',
          fr: 'Un terme décrivant les connexions culturelles et historiques entre l\'Afrique, l\'Europe, les Amériques et les Caraïbes créées par la migration forcée et les routes commerciales.',
          es: 'Un término que describe las conexiones culturales e históricas entre África, Europa, las Américas y el Caribe creadas a través de la migración forzada y las rutas comerciales.',
        },
      },
    ],
  },
  {
    id: 'black-atlantic-canada-ch2',
    order: 2,
    title: {
      en: 'Maps and Memory',
      fr: 'Cartes et Mémoire',
      es: 'Mapas y Memoria',
    },
    description: {
      en: 'Samuel traces his journey on worn maps, remembering those left behind.',
      fr: 'Samuel trace son voyage sur des cartes usées, se souvenant de ceux laissés derrière.',
      es: 'Samuel traza su viaje en mapas desgastados, recordando a los que dejó atrás.',
    },
    text: {
      en: 'In the archive of human memory, Samuel keeps his maps. Each line drawn represents a person, a story, a family tree scattered across continents. The port magistrate asks for documents, but Samuel only has drawings and dreams.',
      fr: 'Dans l\'archive de la mémoire humaine, Samuel garde ses cartes. Chaque ligne tracée représente une personne, une histoire, un arbre généalogique dispersé à travers les continents. Le magistrat du port demande des documents, mais Samuel n\'a que des dessins et des rêves.',
      es: 'En el archivo de la memoria humana, Samuel guarda sus mapas. Cada línea dibujada representa una persona, una historia, un árbol genealógico disperso a través de los continentes. El magistrado del puerto pide documentos, pero Samuel solo tiene dibujos y sueños.',
    },
    media: {
      ambient: { url: '/media/ambient/archive-silence.mp3' },
      narration: { url: '/media/narration/maps-memory-en.mp3', duration: 420 },
    },
    estimatedDuration: 8,
  },
  {
    id: 'black-atlantic-canada-ch3',
    order: 3,
    title: {
      en: 'Settlement in Nova Scotia',
      fr: 'Établissement en Nouvelle-Écosse',
      es: 'Asentamiento en Nueva Escocia',
    },
    description: {
      en: 'Carving out new lives in unfamiliar land, building community against odds.',
      fr: 'Créer une nouvelle vie sur une terre inconnue, construire une communauté contre toute attente.',
      es: 'Tallando nuevas vidas en tierra desconocida, construyendo comunidad contra las adversidades.',
    },
    text: {
      en: 'The winters are unforgiving. Samuel works alongside others who share his story—freed captives, merchants from Barbados, families who walked away from plantations. Together they build Birchtown, a settlement where Black loyalists create their own Canada.',
      fr: 'Les hivers sont impitoyables. Samuel travaille aux côtés d\'autres qui partagent son histoire—captifs libérés, marchands de la Barbade, familles qui se sont éloignées des plantations. Ensemble, ils construisent Birchtown, un établissement où les loyalistes noirs créent leur propre Canada.',
      es: 'Los inviernos son despiadados. Samuel trabaja junto a otros que comparten su historia—cautivos liberados, comerciantes de Barbados, familias que se alejaron de las plantaciones. Juntos construyen Birchtown, un asentamiento donde los leales negros crean su propio Canadá.',
    },
    media: {
      ambient: { url: '/media/ambient/settlement-construction.mp3' },
      music: { url: '/media/music/building-together.mp3' },
    },
    estimatedDuration: 11,
  },
  {
    id: 'black-atlantic-canada-ch4',
    order: 4,
    title: {
      en: 'The Riot of 1784',
      fr: 'L\'Émeute de 1784',
      es: 'El Motín de 1784',
    },
    description: {
      en: 'When promised land becomes contested territory and hope faces erasure.',
      fr: 'Quand la terre promise devient un territoire contesté et l\'espoir face à l\'effacement.',
      es: 'Cuando la tierra prometida se convierte en territorio disputado y la esperanza enfrenta el borrado.',
    },
    text: {
      en: 'Violence erupts on the streets of Birchtown. White loyalists, threatened by Black prosperity, burn homes and destroy what was built. Samuel watches his house collapse into flames, but his mind is elsewhere—on the journal, on the maps, on survival.',
      fr: 'La violence éclate dans les rues de Birchtown. Les loyalistes blancs, menacés par la prospérité noire, brûlent les maisons et détruisent ce qui a été construit. Samuel observe sa maison s\'effondrer en flammes, mais son esprit est ailleurs—sur le journal, sur les cartes, sur la survie.',
      es: 'La violencia estalla en las calles de Birchtown. Los leales blancos, amenazados por la prosperidad negra, queman casas y destruyen lo que fue construido. Samuel ve su casa colapsar en llamas, pero su mente está en otro lugar—en el diario, en los mapas, en la supervivencia.',
    },
    media: {
      ambient: { url: '/media/ambient/riot-conflict.mp3' },
      music: { url: '/media/music/loss-and-resistance.mp3' },
    },
    estimatedDuration: 13,
    contextCards: [
      {
        id: 'black-atlantic-ch4-context1',
        type: 'historical',
        title: {
          en: 'The Birchtown Riot',
          fr: 'L\'Émeute de Birchtown',
          es: 'El Motín de Birchtown',
        },
        content: {
          en: 'June 1784: White loyalists attacked the Black settlement of Birchtown, Nova Scotia, in response to perceived economic competition and racial tension.',
          fr: 'Juin 1784 : Les loyalistes blancs ont attaqué le établissement noir de Birchtown, Nouvelle-Écosse, en réponse à la concurrence économique perçue et aux tensions raciales.',
          es: 'Junio de 1784: Los leales blancos atacaron el asentamiento negro de Birchtown, Nueva Escocia, en respuesta a la competencia económica percibida y las tensiones raciales.',
        },
      },
    ],
  },
  {
    id: 'black-atlantic-canada-ch5',
    order: 5,
    title: {
      en: 'The Migration to Sierra Leone',
      fr: 'La Migration vers la Sierra Leone',
      es: 'La Migración a Sierra Leona',
    },
    description: {
      en: 'Samuel and thousands choose to return across the Atlantic, seeking home in Africa.',
      fr: 'Samuel et des milliers d\'autres choisissent de retourner à travers l\'Atlantique, cherchant une maison en Afrique.',
      es: 'Samuel y miles eligen regresar a través del Atlántico, buscando hogar en África.',
    },
    text: {
      en: 'The ships sail again in 1792. Over 1,200 Black settlers, including Samuel, board vessels bound for Sierra Leone. A return voyage, a second chance, an uncertain future. Samuel carries his journal and the memory of Birchtown—another city built and lost.',
      fr: 'Les navires naviguent à nouveau en 1792. Plus de 1 200 colons noirs, dont Samuel, montent à bord de navires en direction de la Sierra Leone. Un voyage de retour, une deuxième chance, un avenir incertain. Samuel porte son journal et le souvenir de Birchtown—une autre ville construite et perdue.',
      es: 'Los barcos navegan nuevamente en 1792. Más de 1.200 colonos negros, incluido Samuel, suben a barcos con destino a Sierra Leona. Un viaje de regreso, una segunda oportunidad, un futuro incierto. Samuel lleva su diario y el recuerdo de Birchtown—otra ciudad construida y perdida.',
    },
    media: {
      ambient: { url: '/media/ambient/return-voyage.mp3' },
      music: { url: '/media/music/hope-uncertain.mp3' },
    },
    estimatedDuration: 10,
  },
  {
    id: 'black-atlantic-canada-ch6',
    order: 6,
    title: {
      en: 'Legacy Across Waters',
      fr: 'L\'Héritage à Travers les Eaux',
      es: 'Legado a Través de las Aguas',
    },
    description: {
      en: 'Samuel\'s journal survives. His descendants discover the maps and memories of a Black Atlantic life.',
      fr: 'Le journal de Samuel survit. Ses descendants découvrent les cartes et les souvenirs d\'une vie Atlantique noire.',
      es: 'El diario de Samuel sobrevive. Sus descendientes descubren los mapas y recuerdos de una vida Atlántica negra.',
    },
    text: {
      en: 'Two centuries later, a descendant finds the journal in a family archive. The maps are faded but legible. Samuel\'s words—about Guinea, Birchtown, Sierra Leone—create a thread connecting continents. His story becomes a bridge, linking past and present, loss and resilience.',
      fr: 'Deux siècles plus tard, un descendant trouve le journal dans une archive familiale. Les cartes sont fanées mais lisibles. Les paroles de Samuel—sur la Guinée, Birchtown, la Sierra Leone—créent un fil reliant les continents. Son histoire devient un pont, reliant le passé et le présent, la perte et la résilience.',
      es: 'Dos siglos después, un descendiente encuentra el diario en un archivo familiar. Los mapas están descoloridos pero legibles. Las palabras de Samuel—sobre Guinea, Birchtown, Sierra Leona—crean un hilo que conecta continentes. Su historia se convierte en un puente, conectando pasado y presente, pérdida y resiliencia.',
    },
    media: {
      ambient: { url: '/media/ambient/archive-present.mp3' },
      narration: { url: '/media/narration/legacy-waters-en.mp3', duration: 360 },
    },
    estimatedDuration: 9,
    contextCards: [
      {
        id: 'black-atlantic-ch6-context1',
        type: 'cultural',
        title: {
          en: 'Diaspora and Memory',
          fr: 'Diaspora et Mémoire',
          es: 'Diáspora y Memoria',
        },
        content: {
          en: 'The Black Atlantic narrative centers on how Black communities maintained cultural memory and identity across forced migrations, creating new meaning in diasporic spaces.',
          fr: 'Le récit de l\'Atlantique noir se concentre sur la façon dont les communautés noires ont maintenu la mémoire culturelle et l\'identité à travers les migrations forcées, créant un nouveau sens dans les espaces diasporiques.',
          es: 'La narrativa del Atlántico negro se centra en cómo las comunidades negras mantuvieron la memoria cultural e identidad a través de migraciones forzadas, creando nuevo significado en espacios diaspóricos.',
        },
      },
    ],
  },
];

// ============================================
// WHAT WE CARRY - 5 CHAPTERS
// ============================================

export const whatWeCarryChapters: Chapter[] = [
  {
    id: 'what-we-carry-ch1',
    order: 1,
    title: {
      en: 'The Weight of a Suitcase',
      fr: 'Le Poids d\'une Valise',
      es: 'El Peso de una Maleta',
    },
    description: {
      en: 'What does a refugee carry when they leave everything behind?',
      fr: 'Qu\'est-ce qu\'un réfugié porte quand il abandonne tout?',
      es: '¿Qué lleva un refugiado cuando lo deja todo atrás?',
    },
    text: {
      en: 'Amara packs her suitcase for the last time in Kinshasa. It has to hold everything—a photo of her parents, her mother\'s recipe book, a dress for the climate she doesn\'t know, documents (real and borrowed), and hope. The suitcase is brown and worn, bought at a market fifteen years ago.',
      fr: 'Amara fait ses bagages pour la dernière fois à Kinshasa. Cela doit contenir tout—une photo de ses parents, le livre de recettes de sa mère, une robe pour le climat qu\'elle ne connaît pas, des documents (vrais et empruntés), et l\'espoir. La valise est marron et usée, achetée dans un marché il y a quinze ans.',
      es: 'Amara empaca su maleta por última vez en Kinshasa. Debe contener todo—una foto de sus padres, el libro de recetas de su madre, un vestido para el clima que no conoce, documentos (reales y prestados), y esperanza. La maleta es marrón y desgastada, comprada en un mercado hace quince años.',
    },
    media: {
      ambient: { url: '/media/ambient/kinshasa-apartment.mp3' },
      music: { url: '/media/music/departure-moment.mp3' },
    },
    estimatedDuration: 11,
  },
  {
    id: 'what-we-carry-ch2',
    order: 2,
    title: {
      en: 'Border Crossings',
      fr: 'Traversées des Frontières',
      es: 'Cruces Fronterizos',
    },
    description: {
      en: 'Each border holds a story, a stamp, a moment of uncertainty.',
      fr: 'Chaque frontière détient une histoire, un timbre, un moment d\'incertitude.',
      es: 'Cada frontera contiene una historia, un sello, un momento de incertidumbre.',
    },
    text: {
      en: 'At the airport in Congo, an official studies her documents for what feels like eternity. At Cairo, she barely makes her connection. In Rome, a police officer stops her and speaks in a language she doesn\'t understand. Each border a test, each crossing a negotiation with fear and chance.',
      fr: 'À l\'aéroport au Congo, un fonctionnaire examine ses documents pendant ce qui semble être une éternité. Au Caire, elle arrive de justesse à sa correspondance. À Rome, un policier l\'arrête et parle une langue qu\'elle ne comprend pas. Chaque frontière un test, chaque traversée une négociation avec la peur et le hasard.',
      es: 'En el aeropuerto de Congo, un oficial examina sus documentos durante lo que parece una eternidad. En El Cairo, apenas logra su conexión. En Roma, un policía la detiene y habla en un idioma que no entiende. Cada frontera una prueba, cada cruce una negociación con el miedo y el azar.',
    },
    media: {
      ambient: { url: '/media/ambient/border-airports.mp3' },
    },
    estimatedDuration: 9,
  },
  {
    id: 'what-we-carry-ch3',
    order: 3,
    title: {
      en: 'First Night in Brussels',
      fr: 'Première Nuit à Bruxelles',
      es: 'Primera Noche en Bruselas',
    },
    description: {
      en: 'Arrival, cold concrete, and the kindness of strangers.',
      fr: 'Arrivée, béton froid, et la gentillesse des étrangers.',
      es: 'Llegada, hormigón frío, y la amabilidad de extraños.',
    },
    text: {
      en: 'The hostel is clean but impersonal. A woman named Katia, also a refugee, brings her tea and bread. They don\'t share the same language, but they recognize each other—two people carrying different suitcases with the same weight. Amara opens her mother\'s recipe book for the first time since leaving.',
      fr: 'L\'auberge est propre mais impersonnelle. Une femme nommée Katia, également une réfugiée, lui apporte du thé et du pain. Elles ne partagent pas la même langue, mais elles se reconnaissent—deux personnes portant des valises différentes avec le même poids. Amara ouvre le livre de recettes de sa mère pour la première fois depuis son départ.',
      es: 'El albergue es limpio pero impersonal. Una mujer llamada Katia, también refugiada, le trae té y pan. No comparten el mismo idioma, pero se reconocen—dos personas llevando maletas diferentes con el mismo peso. Amara abre el libro de recetas de su madre por primera vez desde que se fue.',
    },
    media: {
      ambient: { url: '/media/ambient/hostel-night.mp3' },
      music: { url: '/media/music/small-kindnesses.mp3' },
    },
    estimatedDuration: 10,
  },
  {
    id: 'what-we-carry-ch4',
    order: 4,
    title: {
      en: 'Learning to Belong',
      fr: 'Apprendre à Appartenir',
      es: 'Aprendiendo a Pertenecer',
    },
    description: {
      en: 'Languages, jobs, languages, and the daily work of becoming.',
      fr: 'Les langues, les emplois, les langues, et le travail quotidien du devenir.',
      es: 'Idiomas, trabajos, idiomas, y el trabajo diario de llegar a ser.',
    },
    text: {
      en: 'Months pass. Amara\'s Dutch improves. She finds work as a cleaner, then as a translator for NGOs. She gets a small apartment and hangs the photo of her parents on the wall. She cooks from her mother\'s recipes, teaching Katia how to prepare cassava leaf. Slowly, she begins to carry less—fear loosens its grip.',
      fr: 'Les mois passent. Son néerlandais s\'améliore. Elle trouve du travail comme femme de ménage, puis comme traductrice pour des ONG. Elle obtient un petit appartement et accroche la photo de ses parents au mur. Elle cuisine à partir des recettes de sa mère, enseignant à Katia comment préparer les feuilles de manioc. Lentement, elle commence à porter moins—la peur desserre son emprise.',
      es: 'Pasan los meses. Su holandés mejora. Encuentra trabajo como limpiadora, luego como traductora para ONG. Obtiene un pequeño apartamento y cuelga la foto de sus padres en la pared. Cocina desde las recetas de su madre, enseñando a Katia cómo preparar las hojas de yuca. Lentamente, comienza a llevar menos—el miedo afloja su agarre.',
    },
    media: {
      ambient: { url: '/media/ambient/daily-life-brussels.mp3' },
      narration: { url: '/media/narration/learning-belong-en.mp3', duration: 480 },
    },
    estimatedDuration: 12,
  },
  {
    id: 'what-we-carry-ch5',
    order: 5,
    title: {
      en: 'What We Carry Forward',
      fr: 'Ce que Nous Portons Avant',
      es: 'Lo Que Llevamos Adelante',
    },
    description: {
      en: 'Home changes. Identity transforms. What remains?',
      fr: 'La maison change. L\'identité se transforme. Qu\'est-ce qui reste?',
      es: 'El hogar cambia. La identidad se transforma. ¿Qué queda?',
    },
    text: {
      en: 'Three years later, Amara is studying social work. The suitcase sits in her closet, no longer heavy, just containing a life. She visits the market and buys the same dress her mother wore, not to remember what\'s lost, but to carry what endures. She is Congolese-Belgian-Human, and that is enough.',
      fr: 'Trois ans plus tard, Amara étudie le travail social. La valise est dans son placard, plus lourd, juste contenant une vie. Elle visite le marché et achète la même robe que sa mère portait, non pour se souvenir de ce qui est perdu, mais pour porter ce qui persiste. Elle est congolaise-belge-humaine, et c\'est suffisant.',
      es: 'Tres años después, Amara estudia trabajo social. La maleta está en su armario, no más pesada, solo conteniendo una vida. Visita el mercado y compra el mismo vestido que llevaba su madre, no para recordar lo que se perdió, sino para llevar lo que persiste. Es congoleña-belga-humana, y eso es suficiente.',
    },
    media: {
      ambient: { url: '/media/ambient/present-brussels.mp3' },
      music: { url: '/media/music/transformation-hope.mp3' },
    },
    estimatedDuration: 11,
    contextCards: [
      {
        id: 'what-we-carry-ch5-context1',
        type: 'cultural',
        title: {
          en: 'Refugee Identity',
          fr: 'Identité des Réfugiés',
          es: 'Identidad de Refugiados',
        },
        content: {
          en: 'Refugees navigate multiple identities—preserving cultural heritage while adapting to new contexts. This process shapes both personal identity and community belonging.',
          fr: 'Les réfugiés naviguent dans de multiples identités—préservant le patrimoine culturel tout en s\'adaptant à de nouveaux contextes. Ce processus façonne à la fois l\'identité personnelle et l\'appartenance communautaire.',
          es: 'Los refugiados navegan múltiples identidades—preservando el patrimonio cultural mientras se adaptan a nuevos contextos. Este proceso da forma tanto a la identidad personal como a la pertenencia comunitaria.',
        },
      },
    ],
  },
];

// ============================================
// SMALL HISTORIES - 6 CHAPTERS
// ============================================

export const smallHistoriesChapters: Chapter[] = [
  {
    id: 'small-histories-ch1',
    order: 1,
    title: {
      en: 'The Shop on Corner Street',
      fr: 'La Boutique sur Coin Rue',
      es: 'La Tienda en la Esquina de la Calle',
    },
    description: {
      en: 'Small business, big dreams, one woman\'s legacy.',
      fr: 'Petite entreprise, grands rêves, l\'héritage d\'une femme.',
      es: 'Pequeño negocio, grandes sueños, legado de una mujer.',
    },
    text: {
      en: 'Rosa opened her tailor shop in 1952 with five dollars and needle her grandmother gave her. For seventy years, she altered suits, mended broken zippers, and listened to the stories of her clients. The shop became an archive of the neighborhood—every stitch a conversation, every alteration a history.',
      fr: 'Rosa a ouvert sa boutique de couture en 1952 avec cinq dollars et l\'aiguille que sa grand-mère lui avait donnée. Pendant soixante-dix ans, elle a modifié des costumes, réparé des fermetures éclair cassées, et écouté les histoires de ses clients. La boutique est devenue une archive du quartier—chaque point une conversation, chaque altération une histoire.',
      es: 'Rosa abrió su tienda de modista en 1952 con cinco dólares y la aguja que su abuela le dio. Durante setenta años, alteró trajes, reparó cremalleras rotas, y escuchó las historias de sus clientes. La tienda se convirtió en un archivo del vecindario—cada puntada una conversación, cada alteración una historia.',
    },
    media: {
      ambient: { url: '/media/ambient/sewing-shop.mp3' },
      music: { url: '/media/music/legacy-begins.mp3' },
    },
    estimatedDuration: 10,
  },
  {
    id: 'small-histories-ch2',
    order: 2,
    title: {
      en: 'Stitching Stories',
      fr: 'Coudre les Histoires',
      es: 'Cosiendo Historias',
    },
    description: {
      en: 'Every garment carries memory and meaning.',
      fr: 'Chaque vêtement porte la mémoire et le sens.',
      es: 'Cada prenda lleva memoria y significado.',
    },
    text: {
      en: 'A widow brings her husband\'s suit to be taken in. A young man picks up his only dress shirt, needed for his wedding. Rosa\'s hands know their work—how to take something broken and make it whole, something tight and make it fit. She remembers each person, each story, each life passing through her door.',
      fr: 'Une veuve apporte le costume de son mari à réduire. Un jeune homme récupère sa seule chemise habillée, nécessaire pour son mariage. Les mains de Rosa connaissent leur travail—comment prendre quelque chose de brisé et le rendre entier, quelque chose de serré et le faire correspondre. Elle se souvient de chaque personne, chaque histoire, chaque vie passant par sa porte.',
      es: 'Una viuda trae el traje de su esposo para ser reducido. Un joven recoge su única camisa de vestir, necesaria para su boda. Las manos de Rosa conocen su trabajo—cómo tomar algo roto y hacerlo entero, algo apretado y hacerlo encajar. Recuerda a cada persona, cada historia, cada vida que pasa por su puerta.',
    },
    media: {
      ambient: { url: '/media/ambient/shop-customers.mp3' },
    },
    estimatedDuration: 9,
  },
  {
    id: 'small-histories-ch3',
    order: 3,
    title: {
      en: 'The Apprentice',
      fr: 'L\'Apprenti',
      es: 'El Aprendiz',
    },
    description: {
      en: 'Knowledge passes from one generation to the next.',
      fr: 'Le savoir passe d\'une génération à la suivante.',
      es: 'El conocimiento pasa de una generación a la siguiente.',
    },
    text: {
      en: 'Rosa\'s granddaughter sits with her, learning the precision of hemming, the geometry of sleeves. She learns not just techniques, but how to talk to people, how to understand what they need even before they say it. The shop becomes a university, and Rosa, a professor of fabric and human connection.',
      fr: 'La petite-fille de Rosa s\'assoit avec elle, apprenant la précision de l\'ourlet, la géométrie des manches. Elle apprend non seulement les techniques, mais comment parler aux gens, comment comprendre ce dont ils ont besoin avant même qu\'ils le disent. La boutique devient une université, et Rosa, une professeure de tissu et de connexion humaine.',
      es: 'La nieta de Rosa se sienta con ella, aprendiendo la precisión de los dobladillos, la geometría de las mangas. Aprende no solo técnicas, sino cómo hablar con las personas, cómo entender lo que necesitan incluso antes de que lo digan. La tienda se convierte en una universidad, y Rosa, en una profesora de tela y conexión humana.',
    },
    media: {
      ambient: { url: '/media/ambient/teaching-moment.mp3' },
      music: { url: '/media/music/knowledge-transfer.mp3' },
    },
    estimatedDuration: 11,
  },
  {
    id: 'small-histories-ch4',
    order: 4,
    title: {
      en: 'The Changing Neighborhood',
      fr: 'Le Quartier Qui Change',
      es: 'El Vecindario que Cambia',
    },
    description: {
      en: 'Urban renewal, gentrification, the price of progress.',
      fr: 'Rénovation urbaine, gentrification, le prix du progrès.',
      es: 'Renovación urbana, gentrificación, el precio del progreso.',
    },
    text: {
      en: 'The neighborhood transforms. Cafes open where laundromats used to be. Rent climbs and neighbors move away. Rosa\'s shop, now an institution, faces demolition for a luxury building. She doesn\'t fight it—instead she documents. Every photo a farewell, every stitch a memento of a world that\'s disappearing.',
      fr: 'Le quartier se transforme. Des cafés s\'ouvrent où il y avait des laveries. Le loyer grimpe et les voisins déménagent. La boutique de Rosa, maintenant une institution, fait face à la démolition pour un immeuble de luxe. Elle ne le combat pas—au lieu de cela, elle documente. Chaque photo un adieu, chaque point une souvenance d\'un monde qui disparaît.',
      es: 'El vecindario se transforma. Los cafés se abren donde solían estar las lavanderías. El alquiler sube y los vecinos se van. La tienda de Rosa, ahora una institución, enfrenta la demolición para un edificio de lujo. Ella no lo combate—en cambio, documenta. Cada foto un adiós, cada puntada un recuerdo de un mundo que desaparece.',
    },
    media: {
      ambient: { url: '/media/ambient/urban-change.mp3' },
      narration: { url: '/media/narration/changing-neighborhood-en.mp3', duration: 420 },
    },
    estimatedDuration: 12,
  },
  {
    id: 'small-histories-ch5',
    order: 5,
    title: {
      en: 'Archive of Care',
      fr: 'Archive de Soin',
      es: 'Archivo de Cuidado',
    },
    description: {
      en: 'Before the shop closes, its stories are preserved.',
      fr: 'Avant la fermeture de la boutique, ses histoires sont préservées.',
      es: 'Antes de que la tienda cierre, sus historias se preservan.',
    },
    text: {
      en: 'Rosa decides to donate her collection to a local museum. Hundreds of garments with stories attached—the fabric of a community. Each piece is photographed, catalogued, recorded. A suit from a first job. A dress worn at a funeral. A tuxedo from a prom in 1967. The shop becomes a permanent exhibition, a testament to small business, human connection, and the invisible labor of care.',
      fr: 'Rosa décide de faire don de sa collection à un musée local. Des centaines de vêtements avec des histoires attachées—le tissu d\'une communauté. Chaque pièce est photographiée, cataloguée, enregistrée. Un costume d\'un premier emploi. Une robe portée aux funérailles. Un smoking d\'un bal de promo en 1967. La boutique devient une exposition permanente, un témoignage du petit commerce, de la connexion humaine, et du travail invisible du soin.',
      es: 'Rosa decide donar su colección a un museo local. Cientos de prendas con historias adjuntas—el tejido de una comunidad. Cada pieza es fotografiada, catalogada, grabada. Un traje de un primer empleo. Un vestido usado en un funeral. Un esmoquin de un baile de graduación en 1967. La tienda se convierte en una exposición permanente, un testimonio del pequeño comercio, la conexión humana, y el trabajo invisible del cuidado.',
    },
    media: {
      ambient: { url: '/media/ambient/museum-archive.mp3' },
      music: { url: '/media/music/preservation-legacy.mp3' },
    },
    estimatedDuration: 11,
  },
  {
    id: 'small-histories-ch6',
    order: 6,
    title: {
      en: 'Stitched Together',
      fr: 'Cousus Ensemble',
      es: 'Cosidos Juntos',
    },
    description: {
      en: 'Legacy is not what we own, but what we give.',
      fr: 'L\'héritage n\'est pas ce que nous possédons, mais ce que nous donnons.',
      es: 'El legado no es lo que poseemos, sino lo que damos.',
    },
    text: {
      en: 'Rosa\'s granddaughter opens her own shop now, but it\'s different—digital, modern, efficient. Yet she carries her grandmother\'s needle as a talisman. When a customer arrives broken, needing repair, she remembers that being a tailor means being a healer. The work continues, transformed but unbroken. Legacy isn\'t preservation—it\'s continuation.',
      fr: 'La petite-fille de Rosa ouvre sa propre boutique maintenant, mais c\'est différent—numérique, moderne, efficace. Pourtant, elle porte l\'aiguille de sa grand-mère comme un talisman. Quand un client arrive cassé, ayant besoin de réparation, elle se souvient qu\'être couturière signifie être guérisseur. Le travail continue, transformé mais intact. L\'héritage n\'est pas la préservation—c\'est la continuation.',
      es: 'La nieta de Rosa abre su propia tienda ahora, pero es diferente—digital, moderna, eficiente. Sin embargo, lleva la aguja de su abuela como un talismán. Cuando llega un cliente roto, necesitando reparación, recuerda que ser modista significa ser sanadora. El trabajo continúa, transformado pero intacto. El legado no es preservación—es continuación.',
    },
    media: {
      ambient: { url: '/media/ambient/new-shop.mp3' },
      music: { url: '/media/music/continuity-spiral.mp3' },
    },
    estimatedDuration: 10,
    contextCards: [
      {
        id: 'small-histories-ch6-context1',
        type: 'cultural',
        title: {
          en: 'Intergenerational Knowledge',
          fr: 'Savoir Intergénérationnel',
          es: 'Conocimiento Intergeneracional',
        },
        content: {
          en: 'Small family businesses represent crucial repositories of practical knowledge, community relationships, and cultural identity that extend far beyond commerce into meaning-making.',
          fr: 'Les petites entreprises familiales représentent des dépôts cruciaux de savoir pratique, de relations communautaires et d\'identité culturelle qui s\'étendent bien au-delà du commerce vers la création de sens.',
          es: 'Los pequeños negocios familiares representan repositorios cruciales de conocimiento práctico, relaciones comunitarias e identidad cultural que se extienden mucho más allá del comercio hacia la creación de significado.',
        },
      },
    ],
  },
];

// ============================================
// WORK WORTH - 5 CHAPTERS
// ============================================

export const workWorthChapters: Chapter[] = [
  {
    id: 'work-worth-ch1',
    order: 1,
    title: {
      en: 'Invisible Hands',
      fr: 'Mains Invisibles',
      es: 'Manos Invisibles',
    },
    description: {
      en: 'The work that builds society but goes unseen.',
      fr: 'Le travail qui construit la société mais reste invisible.',
      es: 'El trabajo que construye la sociedad pero permanece invisible.',
    },
    text: {
      en: 'Jamal cleans office buildings at 5 AM. He dusts desks, empties trash, restores order to spaces where others plan their lives. No one sees him. No one knows his name. His labor is so normalized it\'s forgotten. Yet without him, the building doesn\'t function. His invisibility is a kind of superpower—everyone depends on it, no one acknowledges it.',
      fr: 'Jamal nettoie les immeubles de bureaux à 5h du matin. Il épousset les bureaux, vide les ordures, rétablit l\'ordre dans les espaces où d\'autres planifient leur vie. Personne ne le voit. Personne ne connaît son nom. Son travail est tellement normalisé qu\'il est oublié. Pourtant, sans lui, l\'immeuble ne fonctionne pas. Son invisibilité est une sorte de superpuissance—tout le monde en dépend, personne ne l\'acknowledge.',
      es: 'Jamal limpia edificios de oficinas a las 5 de la mañana. Polvoriza escritorios, vacía basura, restablece orden en espacios donde otros planifican sus vidas. Nadie lo ve. Nadie sabe su nombre. Su trabajo está tan normalizado que se olvida. Sin embargo, sin él, el edificio no funciona. Su invisibilidad es una especie de superpotencia—todos dependen de ella, nadie la reconoce.',
    },
    media: {
      ambient: { url: '/media/ambient/office-night-shift.mp3' },
      music: { url: '/media/music/invisible-labor.mp3' },
    },
    estimatedDuration: 10,
  },
  {
    id: 'work-worth-ch2',
    order: 2,
    title: {
      en: 'Value and Worth',
      fr: 'Valeur et Mérite',
      es: 'Valor y Mérito',
    },
    description: {
      en: 'What determines the worth of work?',
      fr: 'Qu\'est-ce qui détermine la valeur du travail?',
      es: '¿Qué determina el valor del trabajo?',
    },
    text: {
      en: 'Jamal earns $12 an hour. The software engineer upstairs makes $250 an hour. Is his work worth 20 times less? Who decides? Jamal has been doing this for 15 years. His back hurts. His hands are scarred from cleaning chemicals. He hasn\'t taken a vacation since 2019. Meanwhile, the engineer has stock options, health insurance, a retirement plan. Work worth isn\'t determined by significance—it\'s determined by proximity to profit.',
      fr: 'Jamal gagne 12 $ l\'heure. L\'ingénieur logiciel en haut gagne 250 $ l\'heure. Son travail vaut-il 20 fois moins? Qui décide? Jamal fait cela depuis 15 ans. Son dos fait mal. Ses mains sont cicatrisées par les produits chimiques de nettoyage. Il n\'a pas pris de vacances depuis 2019. Pendant ce temps, l\'ingénieur a des options d\'achat d\'actions, une assurance maladie, un régime de retraite. La valeur du travail n\'est pas déterminée par l\'importance—elle est déterminée par la proximité du profit.',
      es: 'Jamal gana $12 la hora. El ingeniero de software de arriba gana $250 la hora. ¿Su trabajo vale 20 veces menos? ¿Quién decide? Jamal ha estado haciendo esto durante 15 años. Su espalda duele. Sus manos están cicatrizadas por productos químicos de limpieza. No se ha tomado un día de vacaciones desde 2019. Mientras tanto, el ingeniero tiene opciones de compra de acciones, seguro de salud, plan de jubilación. El valor del trabajo no se determina por la importancia—se determina por la proximidad de la ganancia.',
    },
    media: {
      ambient: { url: '/media/ambient/wage-gap-reflection.mp3' },
      narration: { url: '/media/narration/value-worth-en.mp3', duration: 360 },
    },
    estimatedDuration: 11,
  },
  {
    id: 'work-worth-ch3',
    order: 3,
    title: {
      en: 'Dignity in Labor',
      fr: 'Dignité dans le Travail',
      es: 'Dignidad en el Trabajo',
    },
    description: {
      en: 'Can a job without recognition still hold meaning?',
      fr: 'Un travail sans reconnaissance peut-il toujours avoir du sens?',
      es: '¿Puede un trabajo sin reconocimiento todavía tener significado?',
    },
    text: {
      en: 'Jamal has a ritual. Every morning, he arrives early and surveys his work from the previous night. The way the light hits the cleaned windows. The symmetry of arranged chairs. For a few minutes before anyone arrives, the space is perfect—because of him. He knows his work matters, even if no one else acknowledges it. This knowledge is his compensation, meager as it is.',
      fr: 'Jamal a un rituel. Chaque matin, il arrive tôt et regarde son travail de la veille. La façon dont la lumière frappe les fenêtres nettoyées. La symétrie des chaises arrangées. Pendant quelques minutes avant que quiconque n\'arrive, l\'espace est parfait—grâce à lui. Il sait que son travail compte, même si personne d\'autre ne le reconnaît. Cette connaissance est sa compensation, si maigre qu\'elle soit.',
      es: 'Jamal tiene un ritual. Cada mañana, llega temprano e inspecciona su trabajo de la noche anterior. La forma en que la luz golpea las ventanas limpias. La simetría de las sillas arregladas. Durante unos minutos antes de que llegue nadie, el espacio es perfecto—por él. Sabe que su trabajo importa, aunque nadie más lo reconozca. Este conocimiento es su compensación, tan escasa como es.',
    },
    media: {
      ambient: { url: '/media/ambient/morning-ritual.mp3' },
      music: { url: '/media/music/quiet-dignity.mp3' },
    },
    estimatedDuration: 9,
  },
  {
    id: 'work-worth-ch4',
    order: 4,
    title: {
      en: 'Solidarity Across Shifts',
      fr: 'Solidarité À Travers les Changements',
      es: 'Solidaridad a Través de Turnos',
    },
    description: {
      en: 'Workers recognize workers, even across silence.',
      fr: 'Les travailleurs reconnaissent les travailleurs, même dans le silence.',
      es: 'Los trabajadores reconocen a trabajadores, incluso a través del silencio.',
    },
    text: {
      en: 'One morning, a junior employee arrives early and finds Jamal resting on a bench, his back in spasm. Instead of pretending not to see, she stops. She sits with him. Later, she leaves a note with her phone number—\'If you ever need anything, call me.\'  Word spreads. Others begin acknowledging him. A few employees start leaving thank you notes. Small acts, but they transform the space. Jamal is no longer invisible—he\'s acknowledged.',
      fr: 'Un matin, une employée junior arrive tôt et trouve Jamal qui se repose sur un banc, son dos en spasme. Au lieu de prétendre ne pas voir, elle s\'arrête. Elle s\'assoit avec lui. Plus tard, elle laisse une note avec son numéro de téléphone—\'Si vous avez besoin de quoi que ce soit, appelez-moi.\'  La nouvelle se propage. D\'autres commencent à le reconnaître. Quelques employés commencent à laisser des notes de remerciement. De petits gestes, mais ils transforment l\'espace. Jamal n\'est plus invisible—il est reconnu.',
      es: 'Una mañana, una empleada junior llega temprano y encuentra a Jamal descansando en un banco, su espalda en espasmo. En lugar de pretender no ver, se detiene. Se sienta con él. Luego, deja una nota con su número de teléfono—\'Si necesita algo, llámeme.\'  La palabra se propaga. Otros comienzan a reconocerlo. Algunos empleados comienzan a dejar notas de agradecimiento. Pequeños gesto, pero transforman el espacio. Jamal ya no es invisible—es reconocido.',
    },
    media: {
      ambient: { url: '/media/ambient/workplace-connection.mp3' },
      music: { url: '/media/music/human-recognition.mp3' },
    },
    estimatedDuration: 10,
  },
  {
    id: 'work-worth-ch5',
    order: 5,
    title: {
      en: 'Reimagining Value',
      fr: 'Réimaguiner la Valeur',
      es: 'Reimaginando el Valor',
    },
    description: {
      en: 'What would work look like if we valued all labor equally?',
      fr: 'À quoi ressemblerait le travail si nous valorisions tout travail également?',
      es: '¿Cómo se vería el trabajo si valoráramos todo trabajo por igual?',
    },
    text: {
      en: 'Jamal dreams of a future where his work is valued not just acknowledged. A future where cleaning professionals earn living wages, have healthcare, have time off. Where dignity isn\'t something you have to invent for yourself because no one else will give it. His dream isn\'t radical—it\'s simply just. In that future, everyone sees Jamal. And because they see him, they value him. And because they value him, work becomes what it should be—a contribution to community, compensated fairly, honored fully.',
      fr: 'Jamal rêve d\'un avenir où son travail est valorisé, pas seulement reconnu. Un avenir où les professionnels du nettoyage gagnent des salaires décents, ont une assurance maladie, ont du temps libre. Où la dignité n\'est pas quelque chose que vous devez inventer vous-même parce que personne d\'autre ne vous la donnera. Son rêve n\'est pas radical—c\'est simplement juste. Dans cet avenir, tout le monde voit Jamal. Et parce qu\'ils le voient, ils le valorisent. Et parce qu\'ils le valorisent, le travail devient ce qu\'il devrait être—une contribution à la communauté, compensée équitablement, honorée pleinement.',
      es: 'Jamal sueña con un futuro donde su trabajo es valorado, no solo reconocido. Un futuro donde los profesionales de la limpieza ganan salarios dignos, tienen atención médica, tienen tiempo libre. Donde la dignidad no es algo que tienes que inventar para ti mismo porque nadie más te lo dará. Su sueño no es radical—es simplemente justo. En ese futuro, todos ven a Jamal. Y porque lo ven, lo valoran. Y porque lo valoran, el trabajo se convierte en lo que debería ser—una contribución a la comunidad, compensada equitativamente, honrada plenamente.',
    },
    media: {
      ambient: { url: '/media/ambient/future-vision.mp3' },
      music: { url: '/media/music/just-futures.mp3' },
    },
    estimatedDuration: 12,
    contextCards: [
      {
        id: 'work-worth-ch5-context1',
        type: 'institutional',
        title: {
          en: 'Economic Justice in Work',
          fr: 'Justice Économique dans le Travail',
          es: 'Justicia Económica en el Trabajo',
        },
        content: {
          en: 'Service work—cleaning, care, maintenance—is essential to social functioning yet historically undervalued. Addressing this requires systemic recognition of interdependence and fair compensation for all labor.',
          fr: 'Le travail de service—nettoyage, soin, entretien—est essentiel au fonctionnement social mais historiquement sous-évalué. Y remédier nécessite une reconnaissance systémique de l\'interdépendance et une compensation équitable pour tout travail.',
          es: 'El trabajo de servicio—limpieza, cuidado, mantenimiento—es esencial para el funcionamiento social pero históricamente subvalorado. Abordarlo requiere reconocimiento sistémico de interdependencia y compensación justa para todo trabajo.',
        },
      },
    ],
  },
];
