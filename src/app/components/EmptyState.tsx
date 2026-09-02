/**
 * EMPTY STATE COMPONENT
 * SEEN by CREOVA
 * 
 * Displays empty states across all sections
 * Never shows fallback or demo content
 */

import { motion } from 'motion/react';
import { Bookmark, Check, Compass, Heart, Play, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { prefersReducedMotion } from '../utils/motion';

// `import * as Icons from 'lucide-react'` pulls the entire icon library into
// the bundle (lucide-react has 1000+ icon modules) and defeats tree-shaking.
// Add new icon names here as new empty states need them, instead of
// reverting to a namespace import.
const EMPTY_STATE_ICONS: Record<string, LucideIcon> = {
  Bookmark,
  Check,
  Compass,
  Heart,
  Play,
  Info,
};

interface EmptyStateProps {
  icon: string; // Lucide icon name — must be registered in EMPTY_STATE_ICONS
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  const IconComponent = EMPTY_STATE_ICONS[icon] || Info;
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4 }}
      className={`flex flex-col items-center justify-center text-center px-8 py-16 ${className}`}
    >
      {/* Icon */}
      <div className="mb-6 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <IconComponent className="w-8 h-8 text-white/40" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-8">
        {message}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

/**
 * Empty State variants for common scenarios
 */

export function LibraryEmptyInProgress({ onExplore }: { onExplore: () => void }) {
  return (
    <EmptyState
      icon="Play"
      title="No stories in progress"
      message="Start exploring to see your in-progress content here."
      actionLabel="Explore Stories"
      onAction={onExplore}
    />
  );
}

export function LibraryEmptySaved({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon="Bookmark"
      title="No saved content"
      message="Save stories and music you want to revisit later."
      actionLabel="Browse For You"
      onAction={onBrowse}
    />
  );
}

export function LibraryEmptyCompleted({ onExplore }: { onExplore: () => void }) {
  return (
    <EmptyState
      icon="Check"
      title="No completed content"
      message="Content you finish will appear here."
      actionLabel="Start Exploring"
      onAction={onExplore}
    />
  );
}

export function ForYouEmpty({ onExplore }: { onExplore: () => void }) {
  return (
    <EmptyState
      icon="Heart"
      title="Your feed is being prepared"
      message="Check back soon for personalized recommendations based on your preferences."
      actionLabel="Explore Content"
      onAction={onExplore}
    />
  );
}

export function ExploreEmpty({ onReturn }: { onReturn: () => void }) {
  return (
    <EmptyState
      icon="Compass"
      title="No content available"
      message="We're constantly adding new stories, music, and films. Check back soon!"
      actionLabel="Return to For You"
      onAction={onReturn}
    />
  );
}