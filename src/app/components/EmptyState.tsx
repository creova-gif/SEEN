/**
 * EMPTY STATE COMPONENT
 * SEEN by CREOVA
 * 
 * Displays empty states across all sections
 * Never shows fallback or demo content
 */

import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: string; // Lucide icon name
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
  // Dynamically get the icon component
  const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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