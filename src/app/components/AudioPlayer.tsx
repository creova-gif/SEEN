import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { 
  AUDIO_VARIANTS, 
  WAVEFORM_VARIANTS,
  TRANSITIONS,
  triggerHaptic,
  prefersReducedMotion 
} from "../utils/motion";

interface AudioPlayerProps {
  title: string;
  artist: string;
  duration: string;
  progress: number; // 0-100
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (progress: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AudioPlayer({
  title,
  artist,
  duration,
  progress,
  isPlaying,
  onPlay,
  onPause,
  onSeek,
  onNext,
  onPrevious,
}: AudioPlayerProps) {
  const reducedMotion = prefersReducedMotion();
  const [isDragging, setIsDragging] = useState(false);

  const handlePlayPause = () => {
    triggerHaptic('medium');
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleNext = () => {
    if (onNext) {
      triggerHaptic('light');
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      triggerHaptic('light');
      onPrevious();
    }
  };

  return (
    <motion.div
      variants={!reducedMotion ? AUDIO_VARIANTS : undefined}
      animate={isPlaying ? "playing" : "paused"}
      transition={TRANSITIONS.organic}
      className="fixed bottom-24 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-5 z-40"
    >
      <div className="max-w-[428px] mx-auto">
        {/* Track Info */}
        <motion.div 
          className="mb-4"
          animate={{
            opacity: isPlaying ? 1 : 0.7,
          }}
          transition={TRANSITIONS.fade}
        >
          <h3 className="text-sm font-light tracking-wide text-white mb-1 truncate">
            {title}
          </h3>
          <p className="text-xs text-white/40 truncate">{artist}</p>
        </motion.div>

        {/* Waveform / Progress Bar */}
        <div className="relative mb-4">
          {/* Background Bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            {/* Progress */}
            <motion.div
              className="h-full bg-white rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={TRANSITIONS.organic}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  boxShadow: isPlaying 
                    ? "0 0 8px rgba(255,255,255,0.6)" 
                    : "0 0 4px rgba(255,255,255,0.3)",
                }}
                transition={TRANSITIONS.fade}
              />
            </motion.div>
          </div>

          {/* Waveform Visualization (decorative) */}
          {isPlaying && !reducedMotion && (
            <div className="absolute -top-2 left-0 right-0 flex items-center justify-center gap-0.5 pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={WAVEFORM_VARIANTS}
                  initial="idle"
                  animate="playing"
                  transition={{
                    delay: i * 0.03,
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-0.5 h-2 bg-white/20 rounded-full"
                  style={{
                    height: `${4 + Math.random() * 8}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Time */}
        <div className="flex justify-between text-xs text-white/40 mb-6">
          <span>{formatTime(progress, duration)}</span>
          <span>{duration}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Previous */}
          {onPrevious && (
            <motion.button
              type="button"
              onClick={handlePrevious}
              whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
              transition={TRANSITIONS.interaction}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          )}

          {/* Play/Pause */}
          <motion.button
            type="button"
            onClick={handlePlayPause}
            whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            transition={TRANSITIONS.interaction}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center relative overflow-hidden"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {/* Pulse effect when playing */}
            {isPlaying && !reducedMotion && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                animate={{
                  scale: [1, 1.3, 1.3],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}

            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={TRANSITIONS.interaction}
                >
                  <Pause className="w-6 h-6 text-black fill-black" strokeWidth={0} />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={TRANSITIONS.interaction}
                >
                  <Play className="w-6 h-6 text-black fill-black ml-1" strokeWidth={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Next */}
          {onNext && (
            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={!reducedMotion ? { scale: 1.1 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
              transition={TRANSITIONS.interaction}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          )}
        </div>

        {/* Chapter Crossfade Indicator */}
        <AnimatePresence>
          {isPlaying && progress > 95 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={TRANSITIONS.organic}
              className="mt-4 text-center"
            >
              <span className="text-xs text-white/40">Next chapter starting...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function formatTime(progress: number, duration: string): string {
  // Parse duration (format: "MM:SS")
  const [mins, secs] = duration.split(':').map(Number);
  const totalSeconds = mins * 60 + secs;
  
  // Calculate current time
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const currentMins = Math.floor(currentSeconds / 60);
  const currentSecs = currentSeconds % 60;
  
  return `${currentMins}:${currentSecs.toString().padStart(2, '0')}`;
}
