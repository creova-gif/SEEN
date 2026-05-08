import { motion } from "motion/react";
import { useState } from "react";
import type { PersonalizationPreferences } from "../contexts/StoryStateContext";

interface OnboardingAccessibilityProps {
  onComplete: (prefs: PersonalizationPreferences) => void;
}

interface PersonalizationOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export function OnboardingAccessibility({ onComplete }: OnboardingAccessibilityProps) {
  const [options, setOptions] = useState<PersonalizationOption[]>([
    {
      id: "narratives",
      title: "Immersive Narratives",
      description: "Stories unfold with depth and layers, inviting you to linger",
      enabled: false
    },
    {
      id: "audio",
      title: "Rich Audio",
      description: "Sound fills the space—music, ambience, texture",
      enabled: false
    },
    {
      id: "motion",
      title: "Dynamic Motion",
      description: "Visuals breathe and move with cinematic presence",
      enabled: false
    }
  ]);

  const toggleOption = (id: string) => {
    setOptions(prev => 
      prev.map(opt => 
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  const handleComplete = () => {
    // Convert options array to PersonalizationPreferences object
    const prefs: PersonalizationPreferences = {
      immersiveNarratives: options.find(o => o.id === 'narratives')?.enabled || false,
      richAudio: options.find(o => o.id === 'audio')?.enabled || false,
      dynamicMotion: options.find(o => o.id === 'motion')?.enabled || false,
    };
    onComplete(prefs);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mb-12"
      >
        <h2 className="text-xl leading-relaxed text-white/80 mb-3">
          Experience SEEN, your way
        </h2>
        <p className="text-sm text-white/50 leading-relaxed">
          Tune into your frequency—shape how stories, sound, and visuals speak to you
        </p>
      </motion.div>

      {/* Personalization Options */}
      <motion.div 
        className="space-y-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
            onClick={() => toggleOption(option.id)}
            className="w-full p-5 text-left border border-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base text-white/90 mb-1 group-hover:text-white transition-colors duration-300">
                  {option.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                  {option.description}
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex-shrink-0">
                <motion.div
                  animate={{
                    backgroundColor: option.enabled 
                      ? 'rgba(255, 255, 255, 0.9)' 
                      : 'rgba(255, 255, 255, 0.1)'
                  }}
                  className="w-12 h-7 rounded-full border border-white/20 relative"
                >
                  <motion.div
                    animate={{
                      x: option.enabled ? 20 : 2,
                      backgroundColor: option.enabled 
                        ? 'rgb(0, 0, 0)' 
                        : 'rgba(255, 255, 255, 0.4)'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 rounded-full"
                  />
                </motion.div>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Info note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-xs text-white/30 mb-8"
      >
        This is an invitation, not a requirement—adjust these anytime in settings
      </motion.p>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleComplete}
        className="w-full py-5 text-sm tracking-wider uppercase text-white/90 hover:text-white border-t border-white/10 hover:border-white/20 transition-all duration-500"
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
