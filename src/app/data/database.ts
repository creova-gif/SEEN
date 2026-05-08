/**
 * CENTRALIZED CONTENT DATABASE
 * SEEN by CREOVA
 * 
 * Single source of truth for all platform content.
 * Each section queries this database with strict filters.
 */

import type { 
  ContentItem, 
  ContentType, 
  ContentLanguage,
  UserIntent,
  UserRole 
} from './types';

// ============================================
// MUSIC CONTENT
// ============================================

export const MUSIC_CONTENT: ContentItem[] = [
  // ── CREOVA Music ─────────────────────────────────────────────
  // audioSrc accepts: Spotify embed URL, SoundCloud URL, or direct MP3/OGG
  // Single → specific track embed; Album/tracks → artist embed (full discography)
  {
    id: 'creova-single-001',
    type: 'music',
    title: 'New Single — CREOVA',
    description: 'The track that started it all. Written on the night we decided SEEN needed its own sound — a cinematic, genre-blurring piece asking: what does it feel like when a voice that was never supposed to be heard finally breaks through? Built from layered percussion, spoken fragments, and electronic texture, this is the sonic manifesto for SEEN. Stream on Spotify, Apple Music, and all major platforms.',
    duration: '3 min',
    creator: 'CREOVA Music',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    audioSrc: 'https://open.spotify.com/embed/track/4uP4AnhXAVSfdacFrRiOLE?utm_source=generator',
    tags: ['creova', 'single', 'cinematic', 'cultural', 'new-release', 'seen'],
    featured: true,
    new: true,
    trending: true
  },
  {
    id: 'creova-album-001',
    type: 'music',
    title: 'CREOVA — The Album',
    description: 'Every track on this album grew out of SEEN. We wrote alongside the platform — drawing from real conversations with Black, Indigenous, immigrant, and francophone creators who trusted us with their histories. Twelve songs. Twelve stories. None of them made up. From the railway labourers who were erased from the golden spike photograph to the grandmothers who kept their language alive in church basements — this album is the sound of being seen for the first time. Stream on all major platforms.',
    duration: '42 min',
    creator: 'CREOVA Music',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    audioSrc: 'https://open.spotify.com/embed/album/5bmB1hFEdm3OeeMpZm8uIY?utm_source=generator',
    tags: ['creova', 'album', 'cultural', 'storytelling', 'debut', 'seen', 'bipoc'],
    featured: true,
    new: true
  },
  {
    id: 'creova-album-002',
    type: 'music',
    title: 'Racines / Roots',
    description: 'Written during the development of SEEN\'s first BIPOC story season. The central lyric — "je cherche mes racines dans une langue qui m\'a oublié" (I search for my roots in a language that forgot me) — came directly from a creator interview on the platform. Layered with field recordings, percussion, and multilingual verse, this track captures the longing between heritage and reinvention that runs through so many of the stories SEEN was built to tell.',
    duration: '4 min',
    creator: 'CREOVA Music',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    audioSrc: 'https://open.spotify.com/embed/album/5bmB1hFEdm3OeeMpZm8uIY?utm_source=generator',
    tags: ['creova', 'heritage', 'bilingual', 'roots', 'percussion', 'seen'],
    trending: true
  },
  {
    id: 'creova-album-003',
    type: 'music',
    title: 'Corridor',
    description: 'An instrumental built from the sounds of in-between spaces — the hallways, border crossings, and quiet thresholds SEEN creators described when we asked them about belonging. Not quite home. Not quite here. But moving. The percussion mimics footsteps on a train platform; the drones beneath it are field recordings from a corridor in a Niagara church that sheltered freedom seekers. SEEN is this corridor made digital.',
    duration: '5 min',
    creator: 'CREOVA Music',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
    audioSrc: 'https://open.spotify.com/embed/album/5bmB1hFEdm3OeeMpZm8uIY?utm_source=generator',
    tags: ['creova', 'instrumental', 'ambient', 'cultural', 'space', 'seen', 'niagara']
  },
  // ── Other Creators ───────────────────────────────────────────
  {
    id: 'music-002',
    type: 'music',
    title: 'Rythmes Montréalais',
    description: 'Une exploration sonore des quartiers multiculturels de Montréal, fusionnant jazz, hip-hop et musiques du monde.',
    duration: '38 min',
    creator: 'Collectif Urbain',
    releaseDate: 'Jan 2026',
    language: ['fr', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    tags: ['jazz', 'hip-hop', 'montreal', 'urban'],
    new: true
  },
  {
    id: 'music-003',
    type: 'music',
    title: 'Desert Frequencies',
    description: 'Traditional Tuareg guitar meets modular synthesis in this cross-continental collaboration.',
    duration: '52 min',
    creator: 'Tinariwen × Modular Collective',
    releaseDate: 'Dec 2025',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
    tags: ['world', 'electronic', 'guitar', 'collaboration']
  },
  {
    id: 'music-004',
    type: 'music',
    title: 'Sonic Migrations',
    description: 'A documentary soundscape tracing immigrant stories through audio archives and contemporary composition.',
    duration: '1h 15min',
    creator: 'Ana Ferreira',
    releaseDate: 'Nov 2025',
    language: ['en', 'es', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    tags: ['documentary', 'archive', 'migration', 'cultural']
  },
  {
    id: 'music-005',
    type: 'music',
    title: 'Northern Echoes',
    description: 'Ambient soundscapes inspired by the Canadian Arctic, featuring throat singing and electronic drones.',
    duration: '42 min',
    creator: 'Tanya Tagaq & Simon Goff',
    releaseDate: 'Oct 2025',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['ambient', 'arctic', 'indigenous', 'experimental']
  }
];

// ============================================
// STORY CONTENT
// ============================================

export const STORY_CONTENT: ContentItem[] = [
  {
    id: 'story-001',
    type: 'story',
    title: 'Echoes of Light',
    description: 'A photographer discovers hidden stories in Montreal\'s underground metro system through light and shadow.',
    duration: '4 chapters',
    creator: 'Sophie Tremblay',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    tags: ['photography', 'montreal', 'urban', 'visual'],
    featured: true
  },
  {
    id: 'story-002',
    type: 'story',
    title: 'The Last Cassette',
    description: 'Un jeune musicien hérite d\'une cassette mystérieuse qui révèle l\'histoire cachée de sa famille à travers trois générations.',
    duration: '5 chapters',
    creator: 'Marc Beaumont',
    releaseDate: 'Jan 2026',
    language: ['fr', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1526974335478-7b5741355990?w=800',
    tags: ['family', 'music', 'history', 'nostalgia'],
    new: true
  },
  {
    id: 'story-003',
    type: 'story',
    title: 'Borderless Voices',
    description: 'An interactive documentary following four artists navigating identity and belonging across three continents.',
    duration: '6 chapters',
    creator: 'CREOVA Documentary',
    releaseDate: 'Dec 2025',
    language: ['en', 'es', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    tags: ['documentary', 'identity', 'international', 'interactive']
  },
  {
    id: 'story-004',
    type: 'story',
    title: 'Threads of Memory',
    description: 'Historias entrelazadas de tres generaciones de tejedoras en las montañas de Guatemala.',
    duration: '3 chapters',
    creator: 'Elena Morales',
    releaseDate: 'Nov 2025',
    language: ['es', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    tags: ['textile', 'tradition', 'guatemala', 'generational']
  },
  {
    id: 'canadian-railway',
    type: 'story',
    title: 'The Iron Road',
    description: 'The story of the 17,000 Chinese labourers who built Canada\'s transcontinental railway through the Rocky Mountains — the hardest, most dangerous work in Canadian history. They were paid half of what white workers earned, excluded from the photograph at Craigellachie where the last spike was driven, and then taxed $500 to bring their families to a country they helped build. This is the story that was left out of the history books.',
    duration: '4 chapters',
    creator: 'CREOVA Documentary',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    tags: ['railway', 'chinese-canadian', 'bipoc', 'history', 'cpr', 'labour', 'documentary'],
    featured: true,
    new: true,
    trending: true
  },
  {
    id: 'niagara-black-archive',
    type: 'story',
    title: 'Roots in Niagara',
    description: 'A digital archive experience curated with Brock University Special Collections, documenting the Black families who built lives in the Niagara Region — from freedom seekers crossing the river at the end of the Underground Railroad, to the builders of the British Methodist Episcopal Church, to the entrepreneurs and educators who shaped St. Catharines and Niagara-on-the-Lake across two centuries. Explore this living history without travelling to the archive.',
    duration: '4 chapters',
    creator: 'Brock University Special Collections × CREOVA',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    tags: ['black-canadian', 'niagara', 'underground-railroad', 'bipoc', 'archive', 'ontario', 'brock-university'],
    featured: true,
    new: true,
    institutional: true
  },
  {
    id: 'story-saltwater',
    type: 'story',
    title: 'The Saltwater Road',
    description: 'The Black Loyalists arrived in Nova Scotia in 1783, promised land and freedom by the British Crown. What they received was swampland, broken promises, and centuries of erasure. Through the voices of descendants in the Preston and Guysborough communities, this story traces the lineage from the first arrival to the demolition of Africville — and asks what it means to love a country that has never fully loved you back.',
    duration: '5 chapters',
    creator: 'Afua Richardson × CREOVA',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['black-canadian', 'nova-scotia', 'africville', 'loyalists', 'bipoc', 'history', 'documentary'],
    new: true
  }
];

// ============================================
// FILM CONTENT
// ============================================

export const FILM_CONTENT: ContentItem[] = [
  {
    id: 'film-001',
    type: 'film',
    title: 'Concrete Symphony',
    description: 'A cinematic essay on urban architecture and the sounds of construction in three global cities.',
    duration: '28 min',
    creator: 'Karim Hassan',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    tags: ['architecture', 'documentary', 'urban', 'experimental'],
    new: true
  },
  {
    id: 'film-002',
    type: 'film',
    title: 'Les Voix du Fleuve',
    description: 'Court-métrage poétique sur les communautés riveraines du Saint-Laurent et leurs traditions orales.',
    duration: '18 min',
    creator: 'Marie-Claude Dubois',
    releaseDate: 'Jan 2026',
    language: ['fr'],
    mediaSource: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['quebec', 'river', 'tradition', 'poetry']
  },
  {
    id: 'film-003',
    type: 'film',
    title: 'Street Canvases',
    description: 'A visual exploration of street art and graffiti culture across Latin American cities.',
    duration: '35 min',
    creator: 'Diego Ramirez',
    releaseDate: 'Oct 2025',
    language: ['es', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    tags: ['street-art', 'urban', 'latin-america', 'visual']
  },
  {
    id: 'film-africville',
    type: 'film',
    title: 'Remember Africville',
    description: 'Between 1964 and 1970, the City of Halifax demolished Africville — a thriving Black community that had stood for over 200 years — and used garbage trucks to relocate its residents. This short documentary gathers the voices of descendants who watched their homes, their church, and their community vanish in the name of urban renewal. A story of what Canada chose to forget, and the people who never could.',
    duration: '24 min',
    creator: 'Sylvia Hamilton × CREOVA',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    tags: ['africville', 'black-canadian', 'nova-scotia', 'bipoc', 'documentary', 'history', 'displacement'],
    featured: true,
    new: true,
    trending: true
  },
  {
    id: 'film-waters',
    type: 'film',
    title: 'Waters We Cross',
    description: 'A feature documentary following four Indigenous water defenders across British Columbia as they challenge pipeline expansion through their unceded territories. Shot over two years, the film interlaces traditional ecological knowledge, legal battles, and ceremony — asking who holds the right to decide what a river\'s future looks like.',
    duration: '52 min',
    creator: 'Tasha Hubbard × CREOVA',
    releaseDate: 'Feb 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['indigenous', 'water', 'environment', 'bc', 'documentary', 'land-rights'],
    new: true
  },
  {
    id: 'film-golden-spike',
    type: 'film',
    title: 'The Men Not in the Photo',
    description: 'On November 7, 1885, a photograph was taken at Craigellachie, BC, to mark the completion of the Canadian Pacific Railway. No Chinese workers appear in that image. This short film reconstructs who was there and why they were erased — using archival records, oral histories, and original photography. A meditation on who gets to be in the frame.',
    duration: '18 min',
    creator: 'CREOVA Documentary',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    tags: ['chinese-canadian', 'railway', 'cpr', 'bipoc', 'history', 'documentary', 'erasure'],
    new: true,
    trending: true
  }
];

// ============================================
// INSTITUTIONAL COLLECTIONS
// ============================================

export const INSTITUTIONAL_CONTENT: ContentItem[] = [
  {
    id: 'inst-001',
    type: 'collection',
    title: 'National Film Board Archive',
    description: 'Curated selection of NFB documentaries exploring Canadian cultural identity and social movements.',
    duration: '24 films',
    creator: 'NFB Canada',
    releaseDate: 'Ongoing',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    tags: ['archive', 'documentary', 'canada', 'institutional'],
    institutional: true
  },
  {
    id: 'inst-002',
    type: 'archive',
    title: 'Indigenous Audio Archives',
    description: 'Oral histories and traditional music from First Nations, Inuit, and Métis communities across Canada.',
    duration: '180+ recordings',
    creator: 'Cultural Heritage Institute',
    releaseDate: 'Ongoing',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    tags: ['indigenous', 'archive', 'oral-history', 'traditional'],
    institutional: true
  },
  {
    id: 'inst-003',
    type: 'collection',
    title: 'Francophone Music Heritage',
    description: 'Collection patrimoniale de musique francophone du Canada, de la chanson traditionnelle au hip-hop contemporain.',
    duration: '45 albums',
    creator: 'Bibliothèque et Archives nationales du Québec',
    releaseDate: 'Ongoing',
    language: ['fr', 'en'],
    mediaSource: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    tags: ['music', 'francophone', 'heritage', 'quebec'],
    institutional: true
  },
  {
    id: 'inst-brock-niagara',
    type: 'archive',
    title: 'Black Niagara: A Digital Archive',
    description: 'Brock University\'s Special Collections holds one of the most significant archives of Black Canadian history in Ontario — photographs, church records, property documents, and personal correspondence spanning from 1793 to the 1990s. For the first time, this collection is available to explore digitally on SEEN: browse family histories, view digitized primary sources, and listen to oral history recordings without travelling to St. Catharines. The archive documents Black families in Niagara who arrived via the Underground Railroad, built churches and schools, ran businesses, and shaped the region across two centuries.',
    duration: '400+ records',
    creator: 'Brock University Special Collections',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    tags: ['black-canadian', 'niagara', 'archive', 'underground-railroad', 'ontario', 'brock-university', 'bipoc', 'history'],
    institutional: true,
    featured: true,
    new: true
  },
  {
    id: 'inst-cpr-archive',
    type: 'archive',
    title: 'The Iron Road Archive',
    description: 'A curated digital collection documenting the Chinese and South Asian labourers who built the Canadian Pacific Railway. Drawn from Library and Archives Canada, the Chinese Canadian Museum, and community-held records, this archive brings together pay ledgers, immigration records, photographs, and oral histories — many never before published online. Browse the names erased from the official record. Read the letters written home to Guangdong province. Understand the Head Tax not as a policy, but as a life.',
    duration: '600+ records',
    creator: 'Chinese Canadian Museum × CREOVA',
    releaseDate: 'Mar 2026',
    language: ['en', 'fr'],
    mediaSource: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    tags: ['chinese-canadian', 'railway', 'cpr', 'archive', 'bipoc', 'history', 'immigration'],
    institutional: true,
    new: true
  }
];

// ============================================
// COMBINED DATABASE
// ============================================

export const ALL_CONTENT: ContentItem[] = [
  ...MUSIC_CONTENT,
  ...STORY_CONTENT,
  ...FILM_CONTENT,
  ...INSTITUTIONAL_CONTENT
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get content by ID
 */
export function getContentById(id: string): ContentItem | undefined {
  return ALL_CONTENT.find(item => item.id === id);
}

/**
 * Get content by type
 */
export function getContentByType(type: ContentType): ContentItem[] {
  return ALL_CONTENT.filter(item => item.type === type);
}

/**
 * Get content by language
 */
export function getContentByLanguage(language: ContentLanguage): ContentItem[] {
  return ALL_CONTENT.filter(item => item.language.includes(language));
}

/**
 * Search content
 */
export function searchContent(query: string): ContentItem[] {
  const lowerQuery = query.toLowerCase();
  return ALL_CONTENT.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.creator.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
