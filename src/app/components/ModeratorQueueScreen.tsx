import { motion } from "motion/react";
import { Home, Compass, Library, User, Shield, AlertCircle } from "lucide-react";
import { ModerationGovernanceSystem } from "./ModerationGovernanceSystem";

interface ModeratorQueueScreenProps {
  onNavigate: (screen: string) => void;
  isModerator: boolean;
}

export function ModeratorQueueScreen({ onNavigate, isModerator }: ModeratorQueueScreenProps) {
  if (!isModerator) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6"
      >
        <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
        <p className="text-white/40 text-center text-sm">
          Moderation access required.
        </p>
        <button
          onClick={() => onNavigate("for-you")}
          className="mt-6 text-xs text-white/50 hover:text-white/70 transition-colors underline"
        >
          Return to For You
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black overflow-hidden"
    >
      <div className="h-full overflow-auto pb-24">
        <ModerationGovernanceSystem onBack={() => onNavigate("for-you")} />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 pointer-events-none z-50">
        <div className="max-w-[428px] mx-auto px-4 py-4 flex justify-around">
          <button
            type="button"
            onClick={() => onNavigate("for-you")}
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white/60 transition-all duration-300 pointer-events-auto group"
          >
            <Home className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">For You</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white/60 transition-all duration-300 pointer-events-auto group"
          >
            <Compass className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">Explore</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("moderation-queue")}
            className="flex flex-col items-center gap-1.5 text-white transition-all duration-300 pointer-events-auto group"
          >
            <div className="relative">
              <Shield
                className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                strokeWidth={2}
              />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                3
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-medium">Queue</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("library")}
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white/60 transition-all duration-300 pointer-events-auto group"
          >
            <Library className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">Library</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white/60 transition-all duration-300 pointer-events-auto group"
          >
            <User className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] tracking-widest uppercase font-light">Profile</span>
          </button>
        </div>
      </nav>
    </motion.div>
  );
}
