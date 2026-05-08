import { motion } from "motion/react";
import { Play } from "lucide-react";
import { 
  CARD_VARIANTS, 
  TRANSITIONS, 
  getStaggerDelay,
  triggerHaptic,
  prefersReducedMotion 
} from "../utils/motion";

interface ContentCardProps {
  id: string;
  title: string;
  creator?: string;
  duration?: string;
  imageUrl: string;
  category: string;
  badge?: string;
  index?: number;
  onSelect: (id: string) => void;
}

export function ContentCard({ 
  id,
  title, 
  creator,
  duration,
  imageUrl, 
  category,
  badge,
  index = 0,
  onSelect
}: ContentCardProps) {
  const reducedMotion = prefersReducedMotion();

  const handleTap = () => {
    triggerHaptic('light');
    onSelect(id);
  };

  return (
    <motion.button
      type="button"
      onClick={handleTap}
      variants={!reducedMotion ? CARD_VARIANTS : undefined}
      initial="initial"
      animate="visible"
      whileHover={!reducedMotion ? "hover" : undefined}
      whileTap={!reducedMotion ? "tap" : undefined}
      transition={{
        ...TRANSITIONS.reveal,
        delay: getStaggerDelay(index),
      }}
      className="relative w-full aspect-[3/4] overflow-hidden rounded-lg group cursor-pointer text-left"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
          transition={TRANSITIONS.cinematic}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <motion.div 
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 1 }}
          whileHover={!reducedMotion ? { opacity: 0 } : undefined}
          transition={TRANSITIONS.fade}
        />
      </div>

      {/* Badge (Optional) */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...TRANSITIONS.organic, delay: getStaggerDelay(index) + 0.2 }}
            className="text-[10px] tracking-widest uppercase text-white backdrop-blur-md bg-white/10 px-2.5 py-1 rounded-full border border-white/20"
          >
            {badge}
          </motion.span>
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...TRANSITIONS.organic, delay: getStaggerDelay(index) + 0.1 }}
          className="text-[10px] tracking-widest uppercase text-white/60 backdrop-blur-md bg-black/20 px-2.5 py-1 rounded-full border border-white/10"
        >
          {category}
        </motion.span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
        {/* Title & Creator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...TRANSITIONS.organic, delay: getStaggerDelay(index) + 0.3 }}
          className="space-y-1 mb-2"
        >
          <h3 className="text-base font-light tracking-wide text-white leading-tight line-clamp-2">
            {title}
          </h3>
          {creator && (
            <p className="text-xs text-white/60">
              {creator}
            </p>
          )}
        </motion.div>

        {/* Duration & Play Button */}
        <div className="flex items-center justify-between">
          {duration && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...TRANSITIONS.fade, delay: getStaggerDelay(index) + 0.4 }}
              className="text-xs text-white/40"
            >
              {duration}
            </motion.span>
          )}
          
          {/* Play Button - appears on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
            animate={{ opacity: 0 }}
            className="group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" strokeWidth={0} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ boxShadow: "0 0 0 0 rgba(255,255,255,0)" }}
        whileHover={!reducedMotion ? {
          boxShadow: "0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.6)"
        } : undefined}
        transition={TRANSITIONS.interaction}
      />
    </motion.button>
  );
}