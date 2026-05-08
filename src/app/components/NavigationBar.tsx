import { motion } from "motion/react";
import { Search, User } from "lucide-react";
import { useNavigation } from "../navigation/NavigationController";

export function NavigationBar() {
  const { navigateToTab } = useNavigation();

  const handleSearchTap = () => {
    console.log('[Interaction] Search button tapped');
    // Search functionality - future implementation
    // For now, could show toast or navigate to explore with search focus
  };

  const handleProfileTap = () => {
    console.log('[Interaction] Profile button tapped from nav bar');
    navigateToTab('profile');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-5 py-4 backdrop-blur-xl bg-black/40 border-b border-white/5"
    >
      <div className="max-w-[428px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col">
          <h1 className="text-lg tracking-tight text-white">
            SEEN
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">
            by CREOVA
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Search"
            onClick={handleSearchTap}
          >
            <Search className="w-4 h-4 text-white/70" />
          </button>
          <button 
            className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Profile"
            onClick={handleProfileTap}
          >
            <User className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}