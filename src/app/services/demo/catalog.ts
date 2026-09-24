/**
 * Deterministic demo catalog.
 *
 * Creators and collections are DERIVED from the real story catalog
 * (storyDatabase.ts), so they can never drift from what readers can open.
 * Funding opportunities have no source in the catalog yet, so they are seeded
 * here and every one is flagged `isDemo: true` and uses a fictional funder —
 * the UI labels them "Demo listing" so testers never mistake them for real
 * calls for applications.
 */
import { STORY_WORLDS, type StoryWorld } from "../../data/storyDatabase";
import type { Collection, Creator, FundingOpportunity, SeenNotification } from "../contracts";
import { slugify } from "../runtime";

function publicStories(): StoryWorld[] {
  return STORY_WORLDS.filter(s => s.visibility === "public");
}

function topThemes(stories: StoryWorld[], n: number): string[] {
  const counts = new Map<string, number>();
  stories.flatMap(s => s.culturalThemes).forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([t]) => t);
}

export function buildCreators(): Creator[] {
  const byName = new Map<string, StoryWorld[]>();
  for (const s of publicStories()) {
    const name = s.creator.en;
    byName.set(name, [...(byName.get(name) ?? []), s]);
  }
  return [...byName.entries()]
    .map(([name, stories]) => {
      const themes = topThemes(stories, 3);
      const isCollective = /collective|voices|keepers|contributors/i.test(name);
      const count = stories.length;
      return {
        id: slugify(name),
        name,
        bio: `${isCollective ? "A collective" : "A storyteller"} working across ${themes
          .slice(0, 2)
          .join(" and ")
          .toLowerCase()}. ${count} ${count === 1 ? "story" : "stories"} on SEEN.`,
        themes,
        storyIds: stories.map(s => s.id),
        languages: [...new Set(stories.flatMap(s => s.languagesAvailable))],
        orgId: isCollective ? `org_${slugify(name)}` : null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildCollections(): Collection[] {
  const stories = publicStories();
  const themed: Collection[] = [];
  const themeMap = new Map<string, StoryWorld[]>();
  stories.forEach(s => s.culturalThemes.forEach(t => themeMap.set(t, [...(themeMap.get(t) ?? []), s])));
  for (const [theme, list] of [...themeMap.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
    if (list.length < 2) continue;
    themed.push({
      id: `theme-${slugify(theme)}`,
      kind: "thematic",
      title: theme,
      description: `${list.length} stories connected by ${theme.toLowerCase()}, gathered by the SEEN editorial team.`,
      curator: "SEEN Editorial",
      storyIds: list.map(s => s.id),
      coverStoryId: list[0].id,
      orgId: null,
    });
  }

  const partners = new Map<string, StoryWorld[]>();
  stories.forEach(s => {
    if (s.institutionalPartner) partners.set(s.institutionalPartner, [...(partners.get(s.institutionalPartner) ?? []), s]);
  });
  const institutional: Collection[] = [...partners.entries()].map(([partner, list]) => ({
    id: `inst-${slugify(partner)}`,
    kind: "institutional",
    title: `${partner} Selection`,
    description: `Stories presented with ${partner}.`,
    curator: partner,
    storyIds: list.map(s => s.id),
    coverStoryId: list[0].id,
    orgId: `org_${slugify(partner)}`,
  }));

  return [...institutional, ...themed];
}

/** Seed date keeps deadlines deterministic for tests; statuses are computed against "now". */
export const FUNDING_SEED: FundingOpportunity[] = [
  {
    id: "opp-community-archive-microgrant",
    title: "Community Archive Microgrant",
    funder: "SEEN Demo Fund",
    type: "grant",
    amountMin: 1500,
    amountMax: 5000,
    currency: "CAD",
    deadline: "2026-10-01T23:59:00Z",
    summary: "Small grants to digitise, translate and share family and community archives as multimedia stories.",
    eligibility: [
      "Individual creators or unincorporated collectives",
      "Based in Canada",
      "Project uses archival material you have permission to share",
    ],
    disciplines: ["Archives", "Oral history", "Photography"],
    languages: ["en", "fr"],
    steps: ["Describe your archive in 300 words", "Upload 3 sample images or audio clips", "Confirm rights and permissions", "Submit budget (one page)"],
    isDemo: true,
    orgId: null,
  },
  {
    id: "opp-first-voices-residency",
    title: "First Voices Audio Residency",
    funder: "Northern Sound Lab (demo)",
    type: "residency",
    amountMin: 8000,
    amountMax: 8000,
    currency: "CAD",
    deadline: "2026-11-15T23:59:00Z",
    summary: "An eight-week remote residency for audio storytellers producing work in Indigenous languages, with mentorship and studio time.",
    eligibility: ["Indigenous creators", "Some prior audio or radio work", "Project primarily in an Indigenous language"],
    disciplines: ["Audio", "Language revitalisation"],
    languages: ["en", "fr"],
    steps: ["Share a 2-minute audio sample", "Write a project statement", "Name a community reference"],
    isDemo: true,
    orgId: "org_northern-sound-lab",
  },
  {
    id: "opp-migration-stories-commission",
    title: "Migration Stories Commission",
    funder: "SEEN Demo Fund",
    type: "commission",
    amountMin: 12000,
    amountMax: 20000,
    currency: "CAD",
    deadline: "2027-01-31T23:59:00Z",
    summary: "Commissions for multi-chapter SEEN story worlds about migration, diaspora and belonging, published on SEEN in EN/FR/ES.",
    eligibility: ["At least one published story (any platform)", "Able to deliver in English or French", "Available for a 6-month production window"],
    disciplines: ["Interactive storytelling", "Documentary", "Writing"],
    languages: ["en", "fr", "es"],
    steps: ["Pitch (one page)", "Chapter outline", "Portfolio links", "Production timeline", "Budget"],
    isDemo: true,
    orgId: null,
  },
  {
    id: "opp-emerging-editor-fellowship",
    title: "Emerging Story Editor Fellowship",
    funder: "Harbour Media Collective (demo)",
    type: "fellowship",
    amountMin: 15000,
    amountMax: 15000,
    currency: "CAD",
    deadline: "2026-09-10T23:59:00Z",
    summary: "A paid fellowship pairing emerging editors with community storytellers across a full publishing cycle.",
    eligibility: ["Under 3 years of professional editing experience", "Bilingual EN/FR an asset"],
    disciplines: ["Editing", "Curation"],
    languages: ["en", "fr"],
    steps: ["CV", "Editing sample", "Letter of interest"],
    isDemo: true,
    orgId: "org_harbour-media",
  },
];

export function seedNotifications(now: Date): SeenNotification[] {
  const ago = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();
  const newest = publicStories().find(s => s.new) ?? publicStories()[0];
  return [
    {
      id: "n-welcome",
      type: "story",
      title: "Welcome to SEEN",
      body: "Save stories to your library and follow creators to hear when they publish.",
      createdAt: ago(1),
      read: false,
    },
    {
      id: `n-new-${newest.id}`,
      type: "story",
      title: "New story world",
      body: `${newest.title.en} by ${newest.creator.en} is now available.`,
      createdAt: ago(5),
      read: false,
      target: { screen: "story", id: newest.id },
    },
    {
      id: "n-funding-microgrant",
      type: "funding",
      title: "Funding closing soon",
      body: "Community Archive Microgrant (demo listing) closes soon.",
      createdAt: ago(26),
      read: false,
      target: { screen: "opportunity", id: "opp-community-archive-microgrant" },
    },
  ];
}
