import { Language } from '../contexts/StoryStateContext';

// Multilingual text structure
export interface MultilingualText {
  en: string;
  fr: string;
  es: string;
}

// Story World data model
export interface StoryWorld {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  subtitle: MultilingualText;
  category: MultilingualText;
  themes: MultilingualText[];
  availableLanguages: Language[];
  imageUrl: string;
  status: 'draft' | 'published';
  creatorId?: string;
}

// Chapter data model
export interface Chapter {
  id: string;
  storyWorldId: string;
  number: number;
  title: MultilingualText;
  content: MultilingualText;
  subtitle: MultilingualText;
  imageUrl: string;
  audioSrc?: string;
  captionsSrc?: {
    en?: string;
    fr?: string;
    es?: string;
  };
  duration: string;
  orderIndex: number;
  branchChoices?: BranchChoice[]; // NEW: Optional branching choices
  contextCards?: string[]; // NEW: Context card IDs for this chapter
  nextChapterId?: string; // NEW: Default next chapter
}

// Branch Choice data model
export interface BranchChoice {
  id: string;
  questionText: MultilingualText;
  options: BranchOption[];
  impactsOutcome: boolean;
}

export interface BranchOption {
  id: string;
  text: MultilingualText;
  nextChapterId?: string; // Optional - leads to specific chapter
  tag?: string; // For tracking user preference patterns
}

// Context Card data model
export interface ContextCard {
  id: string;
  type: 'artist' | 'cultural' | 'historical' | 'technical' | 'location';
  title: MultilingualText;
  content: MultilingualText;
  imageUrl?: string;
  externalLink?: string;
  relatedTags: string[];
}

// Community Response data model
export interface CommunityResponse {
  id: string;
  chapterId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  responseType: 'text' | 'audio' | 'image';
  content: string; // Text content or URL for audio/image
  timestamp: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  likes: number;
}

// Helper to get text in preferred language with fallback
export function getText(
  text: MultilingualText | string,
  preferredLang: Language = 'en'
): string {
  if (typeof text === 'string') return text;
  
  // Try preferred language
  if (text[preferredLang]) return text[preferredLang];
  
  // Fallback to English
  if (text.en) return text.en;
  
  // Last resort: return first available
  return text[Object.keys(text)[0] as Language] || '';
}

// Sample story worlds
export const STORY_WORLDS: StoryWorld[] = [
  {
    id: 'midnight-resonance',
    title: {
      en: 'Midnight Resonance',
      fr: 'Résonance de Minuit',
      es: 'Resonancia de Medianoche'
    },
    description: {
      en: 'An immersive sonic journey exploring the space between silence and sound, featuring field recordings from late-night sessions in Tokyo, New York, and Lagos.',
      fr: 'Un voyage sonore immersif explorant l\'espace entre le silence et le son, avec des enregistrements de terrain de sessions nocturnes à Tokyo, New York et Lagos.',
      es: 'Un viaje sonoro inmersivo que explora el espacio entre el silencio y el sonido, con grabaciones de campo de sesiones nocturnas en Tokio, Nueva York y Lagos.'
    },
    subtitle: {
      en: 'A journey through sound and silence',
      fr: 'Un voyage à travers le son et le silence',
      es: 'Un viaje a través del sonido y el silencio'
    },
    category: {
      en: 'CREOVA Music',
      fr: 'CREOVA Musique',
      es: 'CREOVA Música'
    },
    themes: [
      {
        en: 'Sound',
        fr: 'Son',
        es: 'Sonido'
      },
      {
        en: 'Urban Culture',
        fr: 'Culture Urbaine',
        es: 'Cultura Urbana'
      },
      {
        en: 'Memory',
        fr: 'Mémoire',
        es: 'Memoria'
      }
    ],
    availableLanguages: ['en', 'fr', 'es'],
    imageUrl: 'https://images.unsplash.com/photo-1762160766849-05ecfddd7481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMG11c2ljaWFuJTIwZGFya3xlbnwxfHx8fDE3NzAxNjc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'published'
  },
  {
    id: 'echoes-of-light',
    title: {
      en: 'Echoes of Light',
      fr: 'Échos de Lumière',
      es: 'Ecos de Luz'
    },
    description: {
      en: 'Visual poetry in motion—a cinematic exploration of light, shadow, and the spaces in between.',
      fr: 'Poésie visuelle en mouvement—une exploration cinématographique de la lumière, de l\'ombre et des espaces intermédiaires.',
      es: 'Poesía visual en movimiento—una exploración cinematográfica de la luz, la sombra y los espaces intermedios.'
    },
    subtitle: {
      en: 'Visual poetry in motion',
      fr: 'Poésie visuelle en mouvement',
      es: 'Poesía visual en movimiento'
    },
    category: {
      en: 'Story World',
      fr: 'Monde d\'Histoire',
      es: 'Mundo de Historia'
    },
    themes: [
      {
        en: 'Film',
        fr: 'Cinéma',
        es: 'Cine'
      },
      {
        en: 'Visual Art',
        fr: 'Art Visuel',
        es: 'Arte Visual'
      }
    ],
    availableLanguages: ['en', 'fr', 'es'],
    imageUrl: 'https://images.unsplash.com/photo-1751309165814-c6fd8e7bb740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBMjQlMjBmaWxtJTIwY2luZW1hdGljJTIwc3RpbGx8ZW58MXx8fHwxNzcwMTY3NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'published'
  }
];

// Chapters for Midnight Resonance
export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    storyWorldId: 'midnight-resonance',
    number: 1,
    orderIndex: 1,
    title: {
      en: 'Silence Before Sound',
      fr: 'Silence Avant le Son',
      es: 'Silencio Antes del Sonido'
    },
    subtitle: {
      en: 'The breath before the note',
      fr: 'Le souffle avant la note',
      es: 'El aliento antes de la nota'
    },
    content: {
      en: 'In the moments before creation, there exists a profound stillness. This is not emptiness, but potential—the breath before the note, the pause before the performance.',
      fr: 'Dans les moments qui précèdent la création, il existe une immobilité profonde. Ce n\'est pas le vide, mais le potentiel—le souffle avant la note, la pause avant la performance.',
      es: 'En los momentos antes de la creación, existe una quietud profunda. Esto no es vacío, sino potencial—el aliento antes de la nota, la pausa antes de la actuación.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1762160766849-05ecfddd7481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMG11c2ljaWFuJTIwZGFya3xlbnwxfHx8fDE3NzAxNjc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '6 min',
    nextChapterId: 'ch2',
    contextCards: ['cc3'], // References to context card IDs
    branchChoices: [
      {
        id: 'branch1',
        questionText: {
          en: 'How do you prefer to experience this sonic journey?',
          fr: 'Comment préférez-vous vivre ce voyage sonore?',
          es: '¿Cómo prefieres experimentar este viaje sonoro?'
        },
        options: [
          {
            id: 'opt1',
            text: {
              en: 'Dive deep into urban soundscapes',
              fr: 'Plonger dans les paysages sonores urbains',
              es: 'Sumergirse en paisajes sonoros urbanos'
            },
            nextChapterId: 'ch2',
            tag: 'urban'
          },
          {
            id: 'opt2',
            text: {
              en: 'Explore the philosophy of silence',
              fr: 'Explorer la philosophie du silence',
              es: 'Explorar la filosofía del silencio'
            },
            nextChapterId: 'ch4',
            tag: 'contemplative'
          }
        ],
        impactsOutcome: true
      }
    ]
  },
  {
    id: 'ch2',
    storyWorldId: 'midnight-resonance',
    number: 2,
    orderIndex: 2,
    title: {
      en: 'Urban Echoes',
      fr: 'Échos Urbains',
      es: 'Ecos Urbanos'
    },
    subtitle: {
      en: 'The city at 3 AM',
      fr: 'La ville à 3h du matin',
      es: 'La ciudad a las 3 AM'
    },
    content: {
      en: 'The city at 3 AM reveals its true voice. Field recordings from Tokyo, New York, and Lagos merge into a sonic tapestry of human presence and absence.',
      fr: 'La ville à 3h du matin révèle sa vraie voix. Des enregistrements de terrain de Tokyo, New York et Lagos fusionnent en une tapisserie sonore de présence et d\'absence humaines.',
      es: 'La ciudad a las 3 AM revela su verdadera voz. Grabaciones de campo de Tokio, Nueva York y Lagos se fusionan en un tapiz sonoro de presencia y ausencia humana.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1512010462867-6a82ced24f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGN1bHR1cmUlMjBzdHJlZXQlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzAxNjc3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '8 min',
    nextChapterId: 'ch3',
    contextCards: ['cc1', 'cc2', 'cc4'], // Multiple context cards
    branchChoices: [
      {
        id: 'branch2',
        questionText: {
          en: 'Which city resonates with you most?',
          fr: 'Quelle ville résonne le plus avec vous?',
          es: '¿Qué ciudad resuena más contigo?'
        },
        options: [
          {
            id: 'opt3',
            text: {
              en: 'Tokyo - Precision and silence',
              fr: 'Tokyo - Précision et silence',
              es: 'Tokio - Precisión y silencio'
            },
            tag: 'tokyo'
          },
          {
            id: 'opt4',
            text: {
              en: 'Lagos - Rhythm and energy',
              fr: 'Lagos - Rythme et énergie',
              es: 'Lagos - Ritmo y energía'
            },
            tag: 'lagos'
          },
          {
            id: 'opt5',
            text: {
              en: 'New York - Layered complexity',
              fr: 'New York - Complexité stratifiée',
              es: 'Nueva York - Complejidad estratificada'
            },
            tag: 'nyc'
          }
        ],
        impactsOutcome: false // Soft branch - doesn't change story path
      }
    ]
  },
  {
    id: 'ch3',
    storyWorldId: 'midnight-resonance',
    number: 3,
    orderIndex: 3,
    title: {
      en: 'Resonance & Memory',
      fr: 'Résonance et Mémoire',
      es: 'Resonancia y Memoria'
    },
    subtitle: {
      en: 'Sound carries memory',
      fr: 'Le son porte la mémoire',
      es: 'El sonido lleva la memoria'
    },
    content: {
      en: 'Sound carries memory. Each frequency holds a story, each rhythm a heartbeat. This chapter explores how sonic textures preserve collective experience.',
      fr: 'Le son porte la mémoire. Chaque fréquence contient une histoire, chaque rythme un battement de cœur. Ce chapitre explore comment les textures sonores préservent l\'expérience collective.',
      es: 'El sonido lleva la memoria. Cada frecuencia contiene una historia, cada ritmo un latido. Este capítulo explora cómo las texturas sonoras preservan la experiencia colectiva.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1634564900373-382953f37578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMHBsYXllciUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NzAxNDAxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '7 min',
    nextChapterId: 'ch4',
    contextCards: ['cc2', 'cc3']
  },
  {
    id: 'ch4',
    storyWorldId: 'midnight-resonance',
    number: 4,
    orderIndex: 4,
    title: {
      en: 'The Space Between',
      fr: 'L\'Espace Entre',
      es: 'El Espacio Entre'
    },
    subtitle: {
      en: 'Silence as presence',
      fr: 'Le silence comme présence',
      es: 'El silencio como presencia'
    },
    content: {
      en: 'In music, silence is not absence but presence. The spaces between notes define the melody. Here we listen to what isn\'t played.',
      fr: 'En musique, le silence n\'est pas l\'absence mais la présence. Les espaces entre les notes définissent la mélodie. Ici, nous écoutons ce qui n\'est pas joué.',
      es: 'En la música, el silencio no es ausencia sino presencia. Los espaces entre las notas definen la melodía. Aquí escuchamos lo que no se toca.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1740814422166-8f4cd289f426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBtb21lbnR8ZW58MXx8fHwxNzcwMTY5NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '5 min',
    contextCards: ['cc3', 'cc4']
    // No nextChapterId - this is the final chapter
  }
];

// Helper to get chapters for a story world
export function getChaptersForStory(storyWorldId: string): Chapter[] {
  return CHAPTERS.filter(ch => ch.storyWorldId === storyWorldId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

// Helper to get story world by ID
export function getStoryWorld(id: string): StoryWorld | undefined {
  return STORY_WORLDS.find(sw => sw.id === id);
}

// Helper to get chapter by ID
export function getChapter(chapterId: string): Chapter | undefined {
  return CHAPTERS.find(ch => ch.id === chapterId);
}

// Sample Context Cards
export const CONTEXT_CARDS: ContextCard[] = [
  {
    id: 'cc1',
    type: 'location',
    title: {
      en: 'Tokyo at Midnight',
      fr: 'Tokyo à Minuit',
      es: 'Tokio a Medianoche'
    },
    content: {
      en: 'These field recordings capture the Shibuya district at 3 AM—a moment when the city\'s pulse shifts from chaos to contemplation.',
      fr: 'Ces enregistrements de terrain capturent le quartier de Shibuya à 3h du matin—un moment où le pouls de la ville passe du chaos à la contemplation.',
      es: 'Estas grabaciones de campo capturan el distrito de Shibuya a las 3 AM—un momento en que el pulso de la ciudad cambia del caos a la contemplación.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG5pZ2h0JTIwY2l0eXxlbnwxfHx8fDE3NzAxNzA1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    relatedTags: ['tokyo', 'urban', 'field-recording']
  },
  {
    id: 'cc2',
    type: 'artist',
    title: {
      en: 'The Sound Designer',
      fr: 'Le Concepteur Sonore',
      es: 'El Diseñador de Sonido'
    },
    content: {
      en: 'Sound artist Maya Chen specializes in capturing urban soundscapes, transforming everyday ambient noise into evocative sonic narratives.',
      fr: 'L\'artiste sonore Maya Chen se spécialise dans la capture de paysages sonores urbains, transformant le bruit ambiant quotidien en récits sonores évocateurs.',
      es: 'La artista sonora Maya Chen se especializa en capturar paisajes sonoros urbanos, transformando el ruido ambiental cotidiano en narrativas sonoras evocadoras.'
    },
    relatedTags: ['sound-design', 'field-recording', 'artist']
  },
  {
    id: 'cc3',
    type: 'cultural',
    title: {
      en: 'The Culture of Silence',
      fr: 'La Culture du Silence',
      es: 'La Cultura del Silencio'
    },
    content: {
      en: 'In Japanese aesthetics, ma (間) represents the space between—the pause that gives meaning to sound. This principle deeply influences the sonic architecture of this work.',
      fr: 'Dans l\'esthétique japonaise, ma (間) représente l\'espace entre—la pause qui donne un sens au son. Ce principe influence profondément l\'architecture sonore de cette œuvre.',
      es: 'En la estética japonesa, ma (間) representa el espacio entre—la pausa que da sentido al sonido. Este principio influye profundamente en la arquitectura sonora de esta obra.'
    },
    relatedTags: ['japanese-aesthetics', 'philosophy', 'culture']
  },
  {
    id: 'cc4',
    type: 'technical',
    title: {
      en: 'Binaural Recording Technique',
      fr: 'Technique d\'Enregistrement Binaural',
      es: 'Técnica de Grabación Binaural'
    },
    content: {
      en: 'This chapter uses binaural audio recording—captured with microphones placed to simulate human ear positioning—creating an immersive 3D soundscape best experienced with headphones.',
      fr: 'Ce chapitre utilise l\'enregistrement audio binaural—capturé avec des microphones placés pour simuler le positionnement de l\'oreille humaine—créant un paysage sonore 3D immersif, idéalement écouté avec des écouteurs.',
      es: 'Este capítulo utiliza grabación de audio binaural—capturada con micrófonos colocados para simular el posicionamiento del oído humano—creando un paisaje sonoro 3D inmersivo mejor experimentado con auriculares.'
    },
    relatedTags: ['technical', 'audio', 'recording']
  }
];

// Sample Community Responses
export const COMMUNITY_RESPONSES: CommunityResponse[] = [
  {
    id: 'resp1',
    chapterId: 'ch1',
    userId: 'user1',
    userName: 'Alex Rivera',
    responseType: 'text',
    content: 'This opening hit me differently. The concept of silence as potential rather than absence completely reframes how I think about creative pauses in my own work.',
    timestamp: '2026-02-02T14:30:00Z',
    moderationStatus: 'approved',
    likes: 47
  },
  {
    id: 'resp2',
    chapterId: 'ch1',
    userId: 'user2',
    userName: 'Sophie Dubois',
    responseType: 'text',
    content: 'Listening to this at 2 AM with headphones felt like meditation. The binaural technique creates such an intimate space.',
    timestamp: '2026-02-03T02:15:00Z',
    moderationStatus: 'approved',
    likes: 32
  },
  {
    id: 'resp3',
    chapterId: 'ch2',
    userId: 'user3',
    userName: 'Jordan Lee',
    responseType: 'text',
    content: 'As someone from Lagos, hearing my city represented in this global sonic narrative is powerful. The 3 AM recordings capture something true about urban life.',
    timestamp: '2026-02-03T18:45:00Z',
    moderationStatus: 'approved',
    likes: 89
  },
  {
    id: 'resp4',
    chapterId: 'ch2',
    userId: 'user4',
    userName: 'Marina Costa',
    responseType: 'text',
    content: 'The transition between cities feels seamless yet distinct. Each location has its own rhythmic signature.',
    timestamp: '2026-02-04T10:20:00Z',
    moderationStatus: 'pending',
    likes: 12
  }
];

// Helper to get context cards for a chapter
export function getContextCardsForChapter(chapterId: string): ContextCard[] {
  const chapter = getChapter(chapterId);
  if (!chapter?.contextCards) return [];
  
  // Map context card IDs to actual context card objects
  return chapter.contextCards
    .map(id => CONTEXT_CARDS.find(cc => cc.id === id))
    .filter((cc): cc is ContextCard => cc !== undefined);
}

// Helper to get community responses for a chapter
export function getResponsesForChapter(chapterId: string): CommunityResponse[] {
  return COMMUNITY_RESPONSES.filter(r => r.chapterId === chapterId && r.moderationStatus === 'approved')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Helper to get all pending responses (for moderation)
export function getPendingResponses(): CommunityResponse[] {
  return COMMUNITY_RESPONSES.filter(r => r.moderationStatus === 'pending')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}