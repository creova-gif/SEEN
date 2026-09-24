import { ChevronRight } from "lucide-react";
import { getLocalizedText, getStoryWorldById, type Language } from "../../data/storyDatabase";
import { SeenImage } from "./SeenImage";

/** Story Card, Layout=Compact (Figma 300:12): thumbnail + title + meta, one tap target. */
export function StoryRow({ storyId, language, onOpen }: { storyId: string; language: Language; onOpen: (id: string) => void }) {
  const story = getStoryWorldById(storyId);
  if (!story) return null;
  const title = getLocalizedText(story.title, language);
  return (
    <button
      type="button"
      data-testid="story-row"
      onClick={() => onOpen(story.id)}
      className="w-full flex items-center gap-4 p-3 rounded-seen-md border border-seen-border bg-seen-surface hover:border-white/20 transition-colors text-left"
    >
      <span className="relative w-16 h-20 rounded-seen-sm overflow-hidden flex-shrink-0">
        <SeenImage src={story.coverImage} alt={title} seed={story.id} decorative className="absolute inset-0 w-full h-full object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-white font-medium line-clamp-2">{title}</span>
        <span className="block text-xs text-seen-secondary mt-1 truncate">{getLocalizedText(story.creator, language)}</span>
        <span className="block text-[10px] tracking-[0.14em] uppercase text-seen-muted mt-2">
          {story.chapterCount} chapters · {story.totalDuration}
        </span>
      </span>
      <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" aria-hidden />
    </button>
  );
}
