import { motion } from "motion/react";

interface OnboardingPurposeProps {
  onNext: () => void;
}

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
        <img
          src="https://images.unsplash.com/photo-1665590309886-1d9d0411fa03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBzaWxob3VldHRlJTIwc3Rvcnl8ZW58MXx8fHwxNzcwMTY4MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="SEEN Purpose"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 pt-16 pb-12 max-w-[428px] mx-auto">
        {/* Top: Logo */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/40">
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
          <p className="text-base leading-relaxed text-white/70 max-w-[300px]">
            SEEN is a cultural operating system—an immersive space for stories, sound, and shared identity.
          </p>
          <p className="text-sm leading-relaxed text-white/50 max-w-[300px]">
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