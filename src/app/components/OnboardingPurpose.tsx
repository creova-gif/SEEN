import { SeenImage } from "./seen/SeenImage";
import { motion } from "motion/react";

interface OnboardingPurposeProps {
  onNext: () => void;
}

/**
 * The manifesto screen right after the S.E.E.N entry button: "This is not social media".
 * PROTECTED (owner decision): never remove or merge it. An e2e test guards it.
 */
export function OnboardingPurpose({ onNext }: OnboardingPurposeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-black overflow-hidden"
    >
      {/* Full-bleed immersive image */}
      <div className="absolute inset-0">
        <SeenImage src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1080&h=1600&fit=crop" alt="Open books on a table" seed="seen-purpose" decorative className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 pt-16 pb-12 max-w-[428px] mx-auto">
        {/* Top: Logo */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/55">
              SEEN
            </p>
          </div>
        </div>

        {/* Center: Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl leading-tight tracking-tight text-white max-w-[320px]">
            This is not
            <br />
            social media
          </h1>
          <p className="text-base leading-relaxed text-white/80 max-w-[300px]">
            SEEN is a cultural operating system—an immersive space for stories, sound, and shared identity.
          </p>
          <p className="text-sm leading-relaxed text-white/75 max-w-[300px]">
            No follower counts. No engagement metrics. 
            Just human connection through art.
          </p>
        </motion.div>

        {/* Bottom: CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full py-4 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors"
        >
          <span className="text-sm tracking-wider uppercase">
            Continue
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}