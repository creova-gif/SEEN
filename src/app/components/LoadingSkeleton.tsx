import { motion } from "motion/react";

/**
 * LOADING SKELETON
 * SEEN by CREOVA
 *
 * Reusable placeholder blocks for the brief window where content is not
 * yet on screen — mirrors the visual shape of ContentCard.tsx (aspect-[3/4]
 * poster, category pill top-left, title/creator/duration bottom) so a
 * skeleton state can sit in the exact grid a real card would occupy without
 * a layout jump when the real content swaps in.
 *
 * There was no reusable "shaped" skeleton in the codebase before this —
 * only the generic shadcn `ui/skeleton.tsx` primitive (a plain pulsing
 * rectangle), which nothing currently renders. This file is additive and
 * does not replace that primitive.
 *
 * Most data in this app resolves synchronously from local modules
 * (storyDatabase.ts, etc.), so there is no screen today that truly needs to
 * show this for multiple seconds. The two places a skeleton would be
 * honestly justified:
 *  1. AuthContext.tsx's `signUp`/`signIn` — both `await sleep(400)` before
 *     resolving, simulating network latency. A caller could show
 *     `SkeletonCardRow` (or a simple spinner) for that ~400ms window instead
 *     of a static disabled button.
 *  2. Cover images (`story.coverImage`, all remote Unsplash URLs) have no
 *     loaded/loading state tracked anywhere — ContentCard, FeaturedStoryPreview,
 *     and StoryChapterScreen all render `<img>`/`<motion.img>` directly with
 *     no onLoad/placeholder. `SkeletonCard` is shaped so it can be swapped in
 *     for a card slot until its image's onLoad fires, if that tracking is
 *     ever added.
 */

interface SkeletonCardProps {
  /** Show the bottom title/creator text placeholder lines. Default true. */
  showText?: boolean;
  className?: string;
}

/** Single card-shaped placeholder, sized and structured like ContentCard.tsx. */
export function SkeletonCard({ showText = true, className = "" }: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={`relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-white/5 border border-white/10 animate-pulse ${className}`}
    >
      {/* Category pill placeholder */}
      <div className="absolute top-3 left-3 h-5 w-16 rounded-full bg-white/10" />
      {/* Bottom text block placeholder */}
      {showText && (
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
          <div className="h-4 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/10" />
          <div className="flex items-center justify-between pt-1">
            <div className="h-3 w-10 rounded bg-white/10" />
            <div className="h-8 w-8 rounded-full bg-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}

interface SkeletonCardRowProps {
  count?: number;
  className?: string;
}

/** Horizontal rail of skeleton cards — matches a horizontally-scrolling content rail. */
export function SkeletonCardRow({ count = 3, className = "" }: SkeletonCardRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex gap-4 overflow-hidden ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-40 flex-shrink-0">
          <SkeletonCard />
        </div>
      ))}
    </motion.div>
  );
}

interface SkeletonCardGridProps {
  count?: number;
  columns?: 2 | 3;
  className?: string;
}

/** Grid of skeleton cards — matches Explore/Library grid layouts. */
export function SkeletonCardGrid({ count = 6, columns = 2, className = "" }: SkeletonCardGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid gap-4 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"} ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </motion.div>
  );
}

/** Compact inline spinner + label for short, non-layout-shaped waits (e.g. auth latency). */
export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4" role="status" aria-live="polite">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
      />
      {label && <span className="text-sm text-white/50">{label}</span>}
    </div>
  );
}
