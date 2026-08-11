/**
 * Sample story catalog for the mobile app.
 *
 * This mirrors a subset of the real SEEN web catalog (src/app/data/storyDatabase.ts
 * in the repo root) for brand/content continuity across platforms. Both clients
 * are meant to eventually read from the same Supabase backend — this local list
 * is a starting point until that API wiring lands on mobile.
 */

export interface StoryPreview {
  id: string;
  title: string;
  creator: string;
  description: string;
  coverImage: string;
  duration: string;
  theme: string;
}

export const STORIES: StoryPreview[] = [
  {
    id: 'midnight-resonance',
    title: 'Midnight Resonance',
    creator: 'Kira Chen',
    description:
      "A sonic journey through Montreal's underground jazz scene, tracing the lives of three musicians whose paths converge in the city's most mysterious club.",
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=1200&fit=crop',
    duration: '45 min',
    theme: 'Music & Sound',
  },
  {
    id: 'voices-of-migration',
    title: 'Voices of Migration',
    creator: 'Documentary Collective',
    description:
      'An oral history project documenting the journeys of five families who built new lives in Canada, told through their own words and archive materials.',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1200&fit=crop',
    duration: '60 min',
    theme: 'Migration & Diaspora',
  },
  {
    id: 'what-we-carry',
    title: 'What We Carry',
    creator: 'CREOVA Studio',
    description:
      'What do we carry from place to place? Memories, languages, recipes, and traditions passed down through generations.',
    coverImage: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=800&h=1200&fit=crop',
    duration: '15 min',
    theme: 'Cultural Heritage',
  },
];
