export type Language = 'en' | 'fr' | 'es';

export interface MultilingualText {
  en: string;
  fr: string;
  es: string;
}

export interface ContextCard {
  id: string;
  type: 'cultural' | 'historical' | 'institutional';
  title: MultilingualText;
  content: MultilingualText;
}

export interface ChapterMedia {
  narration?: { url: string; duration: number };
  ambient?: { url: string };
  music?: { url: string };
  images?: string[];
}

export interface Chapter {
  id: string;
  order: number;
  title: MultilingualText;
  description: MultilingualText;
  text: MultilingualText;
  media: ChapterMedia;
  estimatedDuration: number;
  contextCards?: ContextCard[];
}

export interface StoryWorld {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  creator: MultilingualText;
  coverImage: string;
  releaseDate: string;
  languagesAvailable: Language[];
  culturalThemes: string[];
  totalDuration: string;
  chapterCount: number;
  chapters: Chapter[];
  visibility: 'public' | 'institutional' | 'private';
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
  institutionalPartner?: string;
}

export const STORY_WORLDS: StoryWorld[] = [
  {
    id: 'midnight-resonance',
    title: { en: 'Midnight Resonance', fr: 'Résonance de Minuit', es: 'Resonancia de Medianoche' },
    description: {
      en: 'A sonic journey through Montreal\'s underground jazz scene, tracing the lives of three musicians whose paths converge in the city\'s most mysterious club.',
      fr: 'Un voyage sonore à travers la scène jazz underground de Montréal, retraçant la vie de trois musiciens dont les chemins convergent dans le club le plus mystérieux de la ville.',
      es: 'Un viaje sonoro a través de la escena de jazz underground de Montreal.',
    },
    creator: { en: 'Kira Chen', fr: 'Kira Chen', es: 'Kira Chen' },
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=1200&fit=crop',
    releaseDate: 'Feb 2026',
    languagesAvailable: ['en', 'fr', 'es'],
    culturalThemes: ['Music & Sound', 'Urban Culture', 'Community Stories'],
    totalDuration: '45 min',
    chapterCount: 4,
    featured: true,
    new: true,
    trending: true,
    visibility: 'public',
    chapters: [
      {
        id: 'midnight-resonance-ch1',
        order: 1,
        title: { en: 'The First Note', fr: 'La Première Note', es: 'La Primera Nota' },
        description: {
          en: 'Maya discovers an unmarked door in the Plateau, leading to a world she never knew existed.',
          fr: 'Maya découvre une porte non marquée dans le Plateau.',
          es: 'Maya descubre una puerta sin marcar en el Plateau.',
        },
        text: {
          en: 'The snow falls heavy on Rue Saint-Denis. Maya pulls her coat tighter, saxophone case strapped across her back. She\'s walked this street a thousand times, but tonight something feels different. A bass line pulses from somewhere below ground — low, insistent, like a heartbeat the city forgot it had.\n\nShe stops. Looks down. There\'s a door in the sidewalk, painted over so many times the colour has no name anymore. But it\'s open. Just barely.',
          fr: 'La neige tombe lourdement sur la rue Saint-Denis. Maya resserre son manteau, étui de saxophone sanglé dans le dos. Une ligne de basse pulse quelque part sous terre...',
          es: 'La nieve cae pesadamente sobre la Rue Saint-Denis. Maya se ciñe el abrigo. Una línea de bajo pulsa desde algún lugar bajo tierra...',
        },
        media: { ambient: { url: '' }, music: { url: '' } },
        estimatedDuration: 10,
        contextCards: [
          {
            id: 'plateau-context',
            type: 'cultural',
            title: {
              en: 'Montreal\'s Plateau Neighborhood',
              fr: 'Le Quartier du Plateau à Montréal',
              es: 'El Barrio Plateau de Montreal',
            },
            content: {
              en: 'The Plateau-Mont-Royal has been Montreal\'s cultural heartbeat since the 1960s, home to artists, musicians, and the city\'s underground creative scene.',
              fr: 'Le Plateau-Mont-Royal est le cœur culturel de Montréal depuis les années 1960.',
              es: 'El Plateau-Mont-Royal ha sido el corazón cultural de Montreal desde los años 1960.',
            },
          },
        ],
      },
      {
        id: 'midnight-resonance-ch2',
        order: 2,
        title: { en: 'Underground Harmonies', fr: 'Harmonies Souterraines', es: 'Armonías Subterráneas' },
        description: {
          en: 'Inside the club, three musicians meet for the first time, each carrying their own story.',
          fr: 'À l\'intérieur du club, trois musiciens se rencontrent pour la première fois.',
          es: 'Dentro del club, tres músicos se encuentran por primera vez.',
        },
        text: {
          en: 'The club is smaller than Maya imagined. Red velvet walls absorb every sound. A drummer sits alone at the kit, eyes closed, counting something only he can hear. A bassist tunes in the corner, fingers moving across strings like he\'s reading Braille.\n\nAnd Maya, saxophone in hand, realizes this is the audition she\'s been waiting for her entire life — except no one told her it was happening.',
          fr: 'Le club est plus petit que Maya l\'imaginait. Les murs de velours rouge absorbent chaque son.',
          es: 'El club es más pequeño de lo que Maya imaginó. Las paredes de terciopelo rojo absorben cada sonido.',
        },
        media: { ambient: { url: '' }, music: { url: '' } },
        estimatedDuration: 12,
      },
      {
        id: 'midnight-resonance-ch3',
        order: 3,
        title: { en: 'The Session', fr: 'La Séance', es: 'La Sesión' },
        description: {
          en: 'The trio plays together for the first time, creating something neither planned nor expected.',
          fr: 'Le trio joue ensemble pour la première fois.',
          es: 'El trío toca junto por primera vez.',
        },
        text: {
          en: 'No words are spoken. The drummer counts off with a whispered "one, two..." and suddenly the room is alive. Maya\'s saxophone weaves between Marcus\'s bass and Theo\'s drums. They\'ve never played together, but somehow, they\'ve known each other forever.\n\nThis is what Montreal sounds like when no one is watching.',
          fr: 'Aucun mot n\'est prononcé. Le batteur compte à voix basse "un, deux..." et soudain la pièce s\'anime.',
          es: 'No se dicen palabras. El baterista cuenta con un susurro "uno, dos..."',
        },
        media: { music: { url: '' } },
        estimatedDuration: 15,
        contextCards: [
          {
            id: 'jazz-improvisation',
            type: 'cultural',
            title: { en: 'Jazz Improvisation', fr: 'Improvisation Jazz', es: 'Improvisación de Jazz' },
            content: {
              en: 'In jazz, improvisation is conversation. Musicians respond to each other in real-time, creating unrepeatable moments of collective creation.',
              fr: 'Dans le jazz, l\'improvisation est une conversation.',
              es: 'En el jazz, la improvisación es conversación.',
            },
          },
        ],
      },
      {
        id: 'midnight-resonance-ch4',
        order: 4,
        title: { en: 'Resonance', fr: 'Résonance', es: 'Resonancia' },
        description: {
          en: 'The final note rings out, and everything changes.',
          fr: 'La dernière note retentit, et tout change.',
          es: 'La nota final resuena, y todo cambia.',
        },
        text: {
          en: 'When the last note fades, the silence is deafening. Maya opens her eyes. Marcus is smiling — the first time she\'s seen his face do anything other than concentrate. Theo is already reaching for his phone to record the next one.\n\nThe club owner nods from the shadows. "Thursday nights," he says. "You start Thursday nights."',
          fr: 'Quand la dernière note s\'estompe, le silence est assourdissant. Maya ouvre les yeux.',
          es: 'Cuando la última nota se desvanece, el silencio es ensordecedor.',
        },
        media: { ambient: { url: '' } },
        estimatedDuration: 8,
      },
    ],
  },
  {
    id: 'canadian-railway',
    title: { en: 'The Iron Road', fr: 'La Route de Fer', es: 'El Camino de Hierro' },
    description: {
      en: 'The story of the 17,000 Chinese labourers who built Canada\'s transcontinental railway — erased from the photograph, taxed $500 to bring their families to the country they helped build.',
      fr: 'L\'histoire des 17 000 travailleurs chinois qui ont construit le chemin de fer transcontinental du Canada.',
      es: 'La historia de los 17,000 trabajadores chinos que construyeron el ferrocarril transcontinental de Canadá.',
    },
    creator: { en: 'CREOVA Documentary', fr: 'CREOVA Documentaire', es: 'CREOVA Documental' },
    coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    releaseDate: 'Mar 2026',
    languagesAvailable: ['en', 'fr'],
    culturalThemes: ['Chinese-Canadian History', 'Labour Rights', 'Erasure & Memory'],
    totalDuration: '50 min',
    chapterCount: 4,
    featured: true,
    new: true,
    trending: true,
    visibility: 'public',
    chapters: [
      {
        id: 'railway-ch1',
        order: 1,
        title: { en: 'The Crossing', fr: 'La Traversée', es: 'El Cruce' },
        description: {
          en: 'In 1881, thousands of men leave Guangdong province for a country that has not yet decided if they are welcome.',
          fr: 'En 1881, des milliers d\'hommes quittent la province du Guangdong.',
          es: 'En 1881, miles de hombres dejan la provincia de Guangdong.',
        },
        text: {
          en: 'Wei Liang is twenty-two years old when he boards the ship at Hong Kong harbour. He carries a canvas bag with three changes of clothes, his father\'s compass, and a photograph of a woman he has agreed to marry when he returns.\n\nHe will never return with the compass. But he will help build something that will outlast every man on that ship.',
          fr: 'Wei Liang a vingt-deux ans quand il monte à bord du navire au port de Hong Kong.',
          es: 'Wei Liang tiene veintidós años cuando sube al barco en el puerto de Hong Kong.',
        },
        media: {},
        estimatedDuration: 12,
        contextCards: [
          {
            id: 'head-tax-context',
            type: 'historical',
            title: { en: 'The Chinese Head Tax', fr: 'La Taxe d\'entrée chinoise', es: 'El Impuesto de Capitación Chino' },
            content: {
              en: 'After the railway was completed in 1885, the Canadian government imposed a $50 "head tax" on Chinese immigrants. By 1903, it was raised to $500 — equivalent to two years\' wages. Between 1885 and 1923, over 81,000 Chinese immigrants paid this tax.',
              fr: 'Après l\'achèvement du chemin de fer en 1885, le gouvernement canadien a imposé une taxe de 50 $ sur les immigrants chinois.',
              es: 'Después de que se completó el ferrocarril en 1885, el gobierno canadiense impuso un impuesto de $50.',
            },
          },
        ],
      },
      {
        id: 'railway-ch2',
        order: 2,
        title: { en: 'The Rockies', fr: 'Les Rocheuses', es: 'Las Rocosas' },
        description: {
          en: 'The most dangerous work in Canadian history. Half the pay. None of the protection.',
          fr: 'Le travail le plus dangereux de l\'histoire canadienne.',
          es: 'El trabajo más peligroso de la historia canadiense.',
        },
        text: {
          en: 'The dynamite arrives in crates that sweat in the mountain cold. White supervisors set the charges and retreat to a safe distance. Chinese workers are expected to follow — but sometimes the fuses burn faster than promised.\n\nIn the Fraser Canyon, over 600 Chinese workers die in a single year. Their names are not recorded in the official ledgers.',
          fr: 'La dynamite arrive dans des caisses qui transpirent dans le froid de la montagne.',
          es: 'La dinamita llega en cajas que sudan en el frío de la montaña.',
        },
        media: {},
        estimatedDuration: 14,
      },
      {
        id: 'railway-ch3',
        order: 3,
        title: { en: 'The Last Spike', fr: 'Le Dernier Crampon', es: 'El Último Clavo' },
        description: {
          en: 'November 7, 1885. A photograph is taken. Seventeen thousand men are missing from the frame.',
          fr: '7 novembre 1885. Une photographie est prise.',
          es: '7 de noviembre de 1885. Se toma una fotografía.',
        },
        text: {
          en: 'The photograph at Craigellachie shows thirty-one men in overcoats and top hats. Company directors. Politicians. Reporters.\n\nNone of the men who built the railway are in the photograph. The Chinese workers who drove every spike through the Rockies, who blasted every tunnel, who died in numbers no one bothered to count — they are not there.\n\nHistory is what gets into the frame.',
          fr: 'La photographie à Craigellachie montre trente et un hommes en pardessus et hauts-de-forme.',
          es: 'La fotografía en Craigellachie muestra treinta y un hombres con abrigos y sombreros de copa.',
        },
        media: {},
        estimatedDuration: 13,
        contextCards: [
          {
            id: 'craigellachie',
            type: 'historical',
            title: { en: 'Craigellachie, BC', fr: 'Craigellachie, C.-B.', es: 'Craigellachie, BC' },
            content: {
              en: 'The "Last Spike" ceremony on November 7, 1885 marked the completion of the Canadian Pacific Railway. The famous photograph taken that day includes no Chinese workers, though Chinese labourers comprised the majority of the workforce through the most dangerous sections.',
              fr: 'La cérémonie du "Dernier Crampon" le 7 novembre 1885 a marqué l\'achèvement du Chemin de fer Canadien Pacifique.',
              es: 'La ceremonia del "Último Clavo" el 7 de noviembre de 1885 marcó la finalización del Ferrocarril Canadiense del Pacífico.',
            },
          },
        ],
      },
      {
        id: 'railway-ch4',
        order: 4,
        title: { en: 'The Names', fr: 'Les Noms', es: 'Los Nombres' },
        description: {
          en: 'What it means to love a country that has never fully loved you back.',
          fr: 'Ce que cela signifie d\'aimer un pays qui ne vous a jamais pleinement aimé en retour.',
          es: 'Lo que significa amar a un país que nunca te ha amado plenamente.',
        },
        text: {
          en: 'In 2006, Prime Minister Stephen Harper stood in the House of Commons and apologized for the Chinese Head Tax. He read a list of names.\n\nWei Liang\'s name was not on the list. No one knew what happened to him after the railway was finished. The official record shows only that he paid $50 in 1886 and never paid again.\n\nHis descendants are still here. They built this country. They are still being asked to prove they belong.',
          fr: 'En 2006, le Premier ministre Stephen Harper s\'est levé à la Chambre des communes et s\'est excusé pour la taxe d\'entrée chinoise.',
          es: 'En 2006, el Primer Ministro Stephen Harper se puso de pie en la Cámara de los Comunes y se disculpó por el Impuesto de Capitación Chino.',
        },
        media: {},
        estimatedDuration: 11,
      },
    ],
  },
  {
    id: 'niagara-black-archive',
    title: { en: 'Roots in Niagara', fr: 'Racines à Niagara', es: 'Raíces en Niágara' },
    description: {
      en: 'A digital archive experience documenting the Black families who built lives in the Niagara Region — from freedom seekers crossing the river at the end of the Underground Railroad.',
      fr: 'Une expérience d\'archives numériques documentant les familles noires qui ont construit leur vie dans la région de Niagara.',
      es: 'Una experiencia de archivo digital documentando las familias negras que construyeron vidas en la región de Niágara.',
    },
    creator: { en: 'Brock University Special Collections × CREOVA', fr: 'Collections spéciales de l\'Université Brock × CREOVA', es: 'Colecciones Especiales de la Universidad Brock × CREOVA' },
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    releaseDate: 'Mar 2026',
    languagesAvailable: ['en', 'fr'],
    culturalThemes: ['Black Canadian History', 'Underground Railroad', 'Community & Place'],
    totalDuration: '55 min',
    chapterCount: 4,
    featured: true,
    new: true,
    visibility: 'public',
    institutionalPartner: 'Brock University',
    chapters: [
      {
        id: 'niagara-ch1',
        order: 1,
        title: { en: 'The River', fr: 'Le Fleuve', es: 'El Río' },
        description: {
          en: 'The Niagara River was not just a border. For freedom seekers, it was the end of everything they had survived.',
          fr: 'La rivière Niagara n\'était pas seulement une frontière.',
          es: 'El río Niágara no era solo una frontera.',
        },
        text: {
          en: 'Harriet Tubman crossed the Niagara River eight times. She helped over three hundred people reach the Canadian side. The last crossing, in the winter of 1856, was the one she never spoke about.\n\nThe river is narrow at Lewiston — less than a mile. But it runs fast and cold, and the ice forms in jagged plates that shift with the current. People crossed at night. They crossed in November. They crossed because the alternative was not a life at all.',
          fr: 'Harriet Tubman a traversé la rivière Niagara huit fois. Elle a aidé plus de trois cents personnes à atteindre le côté canadien.',
          es: 'Harriet Tubman cruzó el río Niágara ocho veces. Ayudó a más de trescientas personas a llegar al lado canadiense.',
        },
        media: {},
        estimatedDuration: 14,
        contextCards: [
          {
            id: 'underground-railroad',
            type: 'historical',
            title: { en: 'The Underground Railroad', fr: 'Le Chemin de fer clandestin', es: 'El Ferrocarril Clandestino' },
            content: {
              en: 'The Underground Railroad was a network of secret routes and safe houses used by enslaved African Americans to escape to free states and Canada. Between 1850 and 1860, the Niagara region received over 40,000 freedom seekers.',
              fr: 'Le Chemin de fer clandestin était un réseau de routes secrètes et de maisons sûres utilisé par les Afro-Américains réduits en esclavage.',
              es: 'El Ferrocarril Clandestino era una red de rutas secretas y casas de seguridad utilizadas por afroamericanos esclavizados.',
            },
          },
        ],
      },
      {
        id: 'niagara-ch2',
        order: 2,
        title: { en: 'Building St. Catharines', fr: 'Construire St. Catharines', es: 'Construyendo St. Catharines' },
        description: {
          en: 'The community that freedom seekers built — churches, schools, businesses — in a region that would become central to Black Canadian history.',
          fr: 'La communauté que les chercheurs de liberté ont construite.',
          es: 'La comunidad que los buscadores de libertad construyeron.',
        },
        text: {
          en: 'By 1855, St. Catharines had one of the largest concentrations of formerly enslaved people in Canada West. They built the Salem Chapel BME Church on Geneva Street — it still stands. They opened schools when the public schools refused their children. They ran newspapers, barbershops, and boarding houses.\n\nThey built a city within a city. And then the city forgot they were there.',
          fr: 'En 1855, St. Catharines avait l\'une des plus grandes concentrations d\'anciens esclaves dans le Canada-Ouest.',
          es: 'Para 1855, St. Catharines tenía una de las mayores concentraciones de personas anteriormente esclavizadas en el Canadá Oeste.',
        },
        media: {},
        estimatedDuration: 14,
      },
      {
        id: 'niagara-ch3',
        order: 3,
        title: { en: 'The Archive', fr: 'Les Archives', es: 'El Archivo' },
        description: {
          en: 'What Brock University\'s Special Collections holds — and what it means to find your family\'s name in a document that was never meant for you to see.',
          fr: 'Ce que les collections spéciales de l\'Université Brock contiennent.',
          es: 'Lo que contienen las colecciones especiales de la Universidad Brock.',
        },
        text: {
          en: 'Researcher Afua Acheampong found her great-great-grandmother\'s name in a property ledger from 1891. The entry read: "Sold to Miriam W., coloured, 1 acre, Pelham Township, 12 dollars."\n\nTwelve dollars for an acre of land. The deed had her name wrong — it said "Miriam" but she was born "Mirima." The clerk couldn\'t be bothered with the difference.\n\nBut she was there. She owned land. She existed.',
          fr: 'La chercheuse Afua Acheampong a trouvé le nom de son arrière-arrière-grand-mère dans un registre foncier de 1891.',
          es: 'La investigadora Afua Acheampong encontró el nombre de su tatarabuela en un registro de propiedades de 1891.',
        },
        media: {},
        estimatedDuration: 13,
        contextCards: [
          {
            id: 'brock-collections',
            type: 'institutional',
            title: { en: 'Brock University Special Collections', fr: 'Collections spéciales de l\'Université Brock', es: 'Colecciones Especiales de la Universidad Brock' },
            content: {
              en: 'Brock University Library\'s Special Collections and Archives holds primary source materials related to Black Canadian history in the Niagara region, including photographs, church records, property documents, and oral history recordings from 1793 onward.',
              fr: 'Les collections spéciales et archives de la bibliothèque de l\'Université Brock contiennent des documents sur l\'histoire des Noirs canadiens dans la région de Niagara.',
              es: 'Las colecciones especiales y archivos de la biblioteca de la Universidad Brock contienen materiales de fuentes primarias relacionados con la historia afrocanadiense.',
            },
          },
        ],
      },
      {
        id: 'niagara-ch4',
        order: 4,
        title: { en: 'Still Here', fr: 'Toujours là', es: 'Todavía Aquí' },
        description: {
          en: 'The descendants of Niagara\'s Black founders speak about what was left, what was taken, and what it means to finally be seen.',
          fr: 'Les descendants des fondateurs noirs de Niagara parlent de ce qui reste.',
          es: 'Los descendientes de los fundadores negros de Niágara hablan sobre lo que quedó.',
        },
        text: {
          en: '"I grew up in St. Catharines and I didn\'t know any of this," says Jerome Williams, whose family has lived in the region for six generations. "My school taught me about the War of 1812. It did not teach me about the people who came here and built something after everything had been taken from them."\n\n"Now I bring my kids to see the archive. I want them to understand that we didn\'t just arrive here. We made this place."',
          fr: '"J\'ai grandi à St. Catharines et je ne savais rien de tout ça," dit Jerome Williams.',
          es: '"Crecí en St. Catharines y no sabía nada de esto," dice Jerome Williams.',
        },
        media: {},
        estimatedDuration: 14,
      },
    ],
  },
];

export function getStoryWorld(id: string): StoryWorld | undefined {
  return STORY_WORLDS.find(world => world.id === id);
}

export function getChapter(storyId: string, chapterId: string): Chapter | undefined {
  const world = getStoryWorld(storyId);
  return world?.chapters.find(ch => ch.id === chapterId);
}
