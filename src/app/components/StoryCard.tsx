import { motion } from "motion/react";
import { prefersReducedMotion } from "../utils/motion";

interface StoryCardProps {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  readTime: string;
  onSelect: (id: string) => void;
}

export function StoryCard({ id, title, author, imageUrl, readTime, onSelect }: StoryCardProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(id)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
      className="relative w-[280px] flex-shrink-0 overflow-hidden rounded-xl group cursor-pointer text-left"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
        <p className="text-xs tracking-wider uppercase text-white/50">
          {readTime}
        </p>
        <h4 className="text-base leading-snug text-white line-clamp-2">
          {title}
        </h4>
        <p className="text-xs text-white/60">
          by {author}
        </p>
      </div>
    </motion.button>
  );
}
